import { fetchDataFromCollection, signin } from '@/data';
import { createFileRoute, useLocation, useNavigate, useRouteContext } from '@tanstack/react-router'
import { Table as TTable } from "@tanstack/table-core"

import { livestockData } from "../../../../livestock-data"
import { DataTable } from '@/TanstackTable';
import { Header, ProgressBar, Button, Stack, Icon } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import EditForm from '@/EditForm';
import CapacityForm from '@/CapacityForm';
export const Route = createFileRoute('/_authenticated/app/capacity-data')({
    component: RouteComponent,
})

const parseDate = (dateStr: string | Date) => {
    if (typeof dateStr !== "string") return new Date(dateStr).getTime(); // Handle Date objects

    // Check if format matches DD/MM/YYYY using regex
    const ddMmYyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (ddMmYyyyRegex.test(dateStr)) {
        const parts = dateStr.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? NaN : date.getTime();
    }

    // Try parsing normally for other formats
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? NaN : date.getTime();
};

export const dateFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);
    if (!rowValue) return false;

    const rowDate = parseDate(rowValue); // Normalize row date
    const [startDate, endDate] = filterValue.map(date => parseDate(date)); // Normalize filter values

    if (isNaN(rowDate)) {
        console.log("Invalid date format:", rowValue);
        return false;
    }
    if (isNaN(startDate) && isNaN(endDate)) return true; // No filters applied
    if (!isNaN(startDate) && rowDate < startDate) return false; // Before start date
    if (!isNaN(endDate) && rowDate > endDate) return false; // After end date

    return true;
};

function RouteComponent() {
    const [open, setOpen] = useState(false);


    const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);

    const [formData, setFormData] = useState<{ [k: string]: any } | null>(null);

    const columns: ColumnDef<FarmerRecord>[] = [
        {
            accessorKey: "index",
            header: "#",
            cell: ({ row }: { row: { [k: string]: any } }) => (
                <>
                    <EditForm open={open} setOpen={setOpen} formData={formData} setFormData={setFormData} FormComponent={CapacityForm} row={currentRow} collection='Capacity Building' />
                    <Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
                        <Button onClick={() => {
                            setOpen((prev) => !prev)
                            setcCurrentRow(row)
                        }} color='green'><Icon name='interface-edit' /></Button>
                        {row.index + 1}
                    </Stack>,
                </>
            )

            // Row number starts from 1
        },
        {
            accessorKey: "date",
            header: "Date",
            filterFn: dateFilterFn
        },
        {
            accessorKey: "Name",
            header: "Name"
        },
        {
            accessorKey: "Gender",
            header: "Gender",

        },
        {
            accessorKey: "Phone",
            header: "Phone"
        },
        {
            accessorKey: "Location",
            header: "Location"
        },
        {
            accessorKey: "Modules",
            header: "Modules"
        },


    ]
    const capacityQuery = useQuery({
        queryKey: ["capacityQuery"],
        queryFn: () => fetchDataFromCollection("Capacity Building")
    })

    const [total, settotal] = useState(0);
    const [exportFn, setExportFn] = useState<(() => void) | null>(null);

    document.title = "Capacity Data"


    return <>
        <Header slot="header"><h1 className='n-typescale-m font-semibold'>Capacity Building</h1>
            {
                exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
            }
        </Header>
        {
            capacityQuery.isFetching && <ProgressBar />
        }
        {
            capacityQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={capacityQuery.data} setExportFn={setExportFn} />
        }
    </>
}
