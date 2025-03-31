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
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import BoreholeForm from '@/BoreholeForm';
export const Route = createFileRoute('/_authenticated/app/borehole')({
  component: RouteComponent,
})

function RouteComponent() {


  const [open, setOpen] = useState(false);

  document.title = "Borehole Storage"


  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);

  const [formData, setFormData] = useState<{ [k: string]: any } | null>(null);

  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <>
          <EditForm open={open} setOpen={setOpen} formData={formData} setFormData={setFormData} FormComponent={BoreholeForm} row={currentRow} collection='BoreholeStorage' />
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
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Capacity Building</h1>
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

