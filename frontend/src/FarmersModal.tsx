import { Modal, Stack } from '@nordhealth/react';
import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmersTable } from './FarmersTable';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from './data';

const FarmersModal = ({ open, setOpen, farmers }: { 
    open: boolean, 
    setOpen: (value: boolean) => void, 
    farmers: { [k: string]: any }[] | null
}) => {
    
    const columns: ColumnDef<any>[] = [
        { accessorKey: "index", header: "#", cell: ({ row }) => row.index + 1 },
        { accessorKey: "name", header: "Farmer Name" },
        { accessorKey: "gender", header: "Gender" },
        { accessorKey: "idNo", header: "ID" },
        { accessorKey: "phoneNo", header: "Phone" },
    ];
    

    return farmers && (
        <Modal size='m' open={open} onClose={() => setOpen(false)}>
            <h1 slot={"header"}>Farmers</h1>        
            <FarmersTable columns={columns} data={farmers} onTotalChange={()=>console.log("Sum")
            } />
        </Modal>
    );
};

export default FarmersModal;
