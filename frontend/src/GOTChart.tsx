import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
export interface FarmerRecord {
    id: string;
    vaccineType?: string;
    rangeFourth: string;
    timestamp: { seconds: number; nanoseconds: number };
    location: string | number;
    Weight6: string | number;
    dateSubmitted: string;
    Weight3: string | number;
    region: string;
    newBreedFemales: string | number;
    Weight7: string | number;
    rangeSecond: string | number;
    gender?: string; // Optional because it may not always be present
    phoneNo?: string;
    rangeThird: number | string;
    Weight1: string | number;
    femaleGoats: string | number;
    idNo?: string;
    maleGoats: string | number;
    Weight4: string | number;
    Weight5: string | number;
    rangeFirst: string | number;
    Weight2: string | number;
    dewormingSchedule: string;
    name: string;
    newBreedMale: string | number;
    traceability: string;
    newBreedYoung: string | number;
    vaccineDate: string;
}
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function countFarmersAndGoatsPerWeek(data) {
    const weeks = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);
    const farmersPerWeek = weeks.map((_, weekIndex) => {
        return data.filter(item => {
            if (!item.dateSubmitted) return false;
            const date = new Date(item.dateSubmitted);
            const week = Math.floor((date.getDate() - 1) / 7);
            return week === weekIndex;
        }).length;
    });

    const goatsPerWeek = weeks.map((_, weekIndex) => {
        return data.filter(item => {
            if (!item.dateSubmitted) return false;
            const date = new Date(item.dateSubmitted);
            const week = Math.floor((date.getDate() - 1) / 7);
            return week === weekIndex;
        }).reduce((sum, item) => {
            const maleGoats = Number(item.maleGoats) || 0;
            const femaleGoats = Number(item.femaleGoats) || 0;
            return sum + maleGoats + femaleGoats;
        }, 0);
    });

    return { weeks, farmersPerWeek, goatsPerWeek };
}




export function GOTChart({ filteredLivestock }: { filteredLivestock: FarmerRecord[] }) {
    const { weeks, farmersPerWeek, goatsPerWeek } = countFarmersAndGoatsPerWeek(filteredLivestock);
    const data = {
        labels: weeks,
        datasets: [
            {
                label: 'Number of Farmers',
                data: farmersPerWeek,
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 1,
            },
            {
                label: 'Number of Goats',
                data: goatsPerWeek,
                borderColor: '#FFCE56',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
            }
        ]
    }

    const options:ChartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
        },
        plugins: {
            title: {
                display: true,
                text: 'Farmers vs Goats Over Time',
            },
            tooltip: {
                enabled: true,
            },
        },
 
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
        },
    }

    return <Line options={options} data={data} />;
}
