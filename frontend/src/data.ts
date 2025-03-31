// Import Firebase modules
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// const { initializeApp } = require('firebase-admin/app');
import { log } from "console";
import { initializeApp } from "firebase/app";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    limit,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    where
} from "firebase/firestore";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { PricesT } from "./routes/_authenticated/app/prices";
// import { getAnalytics } from "firebase/analytics";
// import { buttonsdiv } from "./livestock.js";

// Firebase Configuration
const APIKEY = import.meta.env.VITE_APIKEY
const AUTHDOMAIN = import.meta.env.VITE_AUTHDOMAIN
const PROJECTID = import.meta.env.VITE_PROJECTID
const STORAGEBUCKET = import.meta.env.VITE_STORAGEBUCKET
const MESSAGINGSENDERID = import.meta.env.VITE_MESSAGINGSENDERID
const APPID = import.meta.env.VITE_MESSAGINGSENDERID
const MEASUREMENTID = import.meta.env.VITE_MEASUREMENTID
const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

// const analytics = getAnalytics(app);

// Authentication Functions
export let userRole;


export const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = []
    querySnapshot.forEach((doc) => {

        let docData = doc.data()
        docData.docId = doc.id
        users.push(docData)
    }
    )
    return users
}
export const updateDocWithId = async (docId: string, updateData: { [k:string]:any }, collection:string) => {
    if (!db) throw new Error('Firestore is not initialized');
    if (!docId) throw new Error('docId is required');

    return await updateDoc(doc(db, collection, docId), updateData);
};
export const updateUser = async (userId: string, updateData: { status: string; name?: string }) => {
    if (!db) throw new Error('Firestore is not initialized');
    if (!userId) throw new Error('userId is required');

    console.log('Updating user:', userId, updateData);

    return await updateDoc(doc(db, 'users', userId), {
        status: updateData.status,
    });
};
export const signin = async (email, password) => {

    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const users = await fetchUsers()

    return users.find((user) => user.email === email)

    // if (!querySnapshot.empty) {
    //     const userData = querySnapshot.docs[0].data();
    //     userRole = userData.role;

    //     // Store user role and authentication status in localStorage
    //     localStorage.setItem("isAuthenticated", 'true');
    //     localStorage.setItem("userRole", userRole);

    //     // Redirect based on role
    //     if (userRole === "chief-admin") {
    //         window.location.href = "dashboard.html";
    //         // Ensure buttons are visible for chief admin

    //     } else if (userRole === "admin") {
    //         window.location.href = "dashboard.html";
    //         // Hide buttons for admin

    //     } else if (userRole === "android-user") {
    //         alert('Unauthorized access!');
    //     }


    //     // return userRole
    // } else {
    //     alert("User not found in Firestore.");
    // }


};

export const signoutuser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error signing out:", error);
    }
};



// Helper function to fetch data from Firestore
export const fetchDataFromCollection = async (collectionName: string, count = Infinity) => {
    const q = query(collection(db, collectionName), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: { [k: string]: any }) => ({ id: doc.id, ...doc.data() }));

};

// Fetch data from specific collections
export const fetchAllData = async () => {
    try {
        const [livestock, fodder, infrastructure, capacity, offtake, offtake0, users, prices] = await Promise.all([
            fetchDataFromCollection("Livestock Farmers"),
            fetchDataFromCollection("Fodder Farmers"),
            fetchDataFromCollection("Infrastructure Data"),
            fetchDataFromCollection("Capacity Building"),
            fetchDataFromCollection("Livestock Offtake Data"),
            fetchDataFromCollection("Fodder Offtake Data"),
            fetchDataFromCollection("users"), // Fetch users collection
            fetchDataFromCollection("prices"),
        ]);

        return { livestock, fodder, infrastructure, capacity, offtake, offtake0, users, prices };
    } catch (error) {
        console.error("Error fetching all data:", error);
        throw error;
    }
};

// Search function
export const searchData = (dataset, query) => {
    if (!query) return dataset;

    const lowerCaseQuery = String(query).toLowerCase();
    return dataset.filter((item) =>
        Object.values(item).some((value) => {
            if (typeof value === "string" || typeof value === "number") {
                return String(value).toLowerCase().includes(lowerCaseQuery);
            }
            return false;
        })
    );
};

// Delete data function
export const CdeleteUser = async (userId: string) => {
    return await deleteDoc(doc(db, 'users', userId))


};

export const savePrices = async (prices: PricesT) => {
    return await addDoc(collection(db, 'prices'), prices);
}

// Update data function
export const updateData = async (collectionName, docId, newData) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, newData);
        console.log(`Document with ID ${docId} successfully updated in ${collectionName}`);
        return true;
    } catch (error) {
        console.error(`Error updating document with ID ${docId} in ${collectionName}:`, error);
        throw error;
    }
};

// Upload Excel file function


// Register a new user
export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;

    // Add user details to Firestore
    return await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        role: userData.role,
        name: userData.name,
        status: "Active", // Default status
        createdAt: new Date(),
    });


};

// Function to check user role and control button visibility
//export let storedRole = localStorage.getItem("userRole");
//export let userw=console.log(storedRole)
export const checkUserRole = () => {
    const storedRole = localStorage.getItem("userRole");
    // try {
    //     if (storedRole === 'chief-admin') {
    //         buttonsdiv.style.display = 'flex';
    //     } else {
    //         buttonsdiv.style.display = 'none';
    //     }
    // } catch (error) {
    //     console.log('Error:', error);
    // }
    return storedRole;  // ✅ Return the role so it can be used later
};


// Call checkUserRole on page load to ensure buttons are shown/hidden correctly
window.onload = checkUserRole();