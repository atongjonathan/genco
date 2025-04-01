import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Header, ProgressBar, Button, Stack, Icon } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import BoreholeForm from '@/BoreholeForm';
export const Route = createFileRoute('/_authenticated/app/borehole')({
  component: RouteComponent,
})

function RouteComponent() {


  const [open, setOpen] = useState(false);

  document.title = "Borehole Storage"


  const [currentRow, setcCurrentRow] = useState<Record<string, any>|null>(null);


  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <>
          <EditForm open={open} setOpen={setOpen} FormComponent={BoreholeForm} row={currentRow} collection='BoreholeStorage' />
          <Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
            <Button onClick={() => {
              setOpen((prev) => !prev)
              setcCurrentRow(row)
            }} color='green'><Icon name='interface-edit' /></Button>
            {row.index + 1}
          </Stack>,
        </>
      )
    },
    {
      accessorKey: "Date",
      header: "Date",
      filterFn: dateFilterFn
    },
    {
      accessorKey: "Borehole Location",
      header: "Location"
    },
    {
      accessorKey: "People Using Borehole",
      header: "People Using",

    },
    {
      accessorKey: "Region",
      header: "Region"
    },
    {
      accessorKey: "Water Used",
      header: "Water Used"
    },



  ]
  const boreholeQuery = useQuery({
    queryKey: ["boreholeQuery"],
    queryFn: () => fetchDataFromCollection("BoreholeStorage")
  })

  const [total, settotal] = useState(0);
  const [exportFn, setExportFn] = useState<(() => any) | null>(null);


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Boerhole Storage</h1>
      {
        exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>
    {
      boreholeQuery.isFetching && <ProgressBar />
    }
    {
      boreholeQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={boreholeQuery.data} setExportFn={setExportFn} />
    }
  </>
}

