import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Header, ProgressBar, Button, Stack, Icon, ButtonGroup } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import EditForm from '@/EditForm';
import CapacityForm from '@/CapacityForm';
export const Route = createFileRoute('/_authenticated/app/capacity-data')({
    component: RouteComponent,
})
import { FilterFn } from '@tanstack/react-table';
import DeleteModal from '@/DeleteModal';

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
    const rowValue = row.getValue(columnId) as string | Date;
    if (!rowValue) return false;

    const rowDate = parseDate(rowValue); // Normalize row date
    
    const [startDate, endDate] = filterValue.map((date:string) => parseDate(date)); // Normalize filter values

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
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);


    const columns: ColumnDef<FarmerRecord>[] = [
        {
            accessorKey: "index",
            header: "#",
            cell: ({ row }: { row: { [k: string]: any } }) => (
                <ButtonGroup variant='spaced'>
                <EditForm open={open} setOpen={setOpen} FormComponent={CapacityForm} row={currentRow} collection='Capacity Building' />
        
                <Button onClick={() => {
                  setOpen((prev) => !prev)
                  
                  setcCurrentRow(row)
                }}>
                  <Icon name='interface-edit' label='Edit' />
                </Button>
                <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='Capacity Building' />
                <Button variant='danger' onClick={() => {
                  setcCurrentRow(row.original)
                  setDeleteOpen((prev) => !prev)
                }}>
                  <Icon name='interface-delete' label='Delete' />
                </Button>
              </ButtonGroup>
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
            accessorKey: "region",
            header: "Region"
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
            capacityQuery.data && <DataTable onTotalChange={()=>console.log("change")
            } columns={columns} data={capacityQuery.data} setExportFn={setExportFn} />
        }
    </>
}
