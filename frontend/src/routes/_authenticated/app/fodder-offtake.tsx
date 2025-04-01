import { createFileRoute } from '@tanstack/react-router'
import { fetchDataFromCollection } from '@/data';
import { DataTable } from '@/TanstackTable';
import { Button, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import FodderOftakeForm from '@/FodderOftakeForm';

export const Route = createFileRoute('/_authenticated/app/fodder-offtake')({
  component: RouteComponent,
})

function RouteComponent() {
  const fodderOfftakeQuery = useQuery({
    queryKey: ["fodderOfftakeQuery"],
    queryFn: () => fetchDataFromCollection("Fodder Offtake Data"),
    staleTime: Infinity
  })

  console.log(fodderOfftakeQuery.data);
  


  const [open, setOpen] = useState(false);
  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);

  document.title = "Fodder Offtake Data"

  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <>
            <EditForm open={open} setOpen={setOpen}  FormComponent={FodderOftakeForm} row={currentRow} collection='Fodder Offtake Data' />
            <Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
                <Button onClick={() => {
                    setOpen((prev) => !prev)
                    setcCurrentRow(row)
                }} color='green'><Icon name='interface-edit' /></Button>
                {row.index + 1}
            </Stack>,
        </>
    )},
    {
      accessorKey: "date",
      header: "Date",
      filterFn: dateFilterFn

    },

    {
      accessorKey: "farmerName",
      header: "Farmer Name"
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number"
    },
    {
      accessorKey:"balePrice",
      header: "Bale Price",
    }
    ,
    {
      accessorKey: "location",
      header: "Location"
    },

    {
      accessorKey: "region",
      header: "Region"
    },

  ]

  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  return   <>
  <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Offtake</h1>
    {
      exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
    }</Header>
  {
    fodderOfftakeQuery.isFetching && <ProgressBar />
  }
  {
    fodderOfftakeQuery.data && <DataTable columns={columns} data={fodderOfftakeQuery.data} setExportFn={setExportFn} />
  }
</>
}
