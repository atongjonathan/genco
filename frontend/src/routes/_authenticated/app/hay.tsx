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
import HayForm from '@/HayForm';

export const Route = createFileRoute(
  '/_authenticated/app/hay',
)({
  component: RouteComponent,
})



function RouteComponent() {
  const [total, settotal] = useState(0);

  const [open, setOpen] = useState(false);



  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);

  const [formData, setFormData] = useState<{ [k: string]: any } | null>(null);

  const hayQuery = useQuery({
    queryKey: ["hayQuery"],
    queryFn: () => fetchDataFromCollection("HayStorage")
  })
  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <>
          <EditForm open={open} setOpen={setOpen} formData={formData} setFormData={setFormData} FormComponent={HayForm} row={currentRow} collection='HayStorage' />
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
      header: "Date"
    },
    {
      accessorKey: "Hay Storage Facility",
      header: "Facility"
    },
    {
      accessorKey: "Region",
      header: "Region"
    },
    {
      accessorKey: "Revenue From Sales",
      header: "Revenue From Sales"
    },
    {
      accessorKey: "Bales Stored",
      header: "Bales Stored"
    },
    {
      accessorKey: "Bales Size",
      header: "Bales Size"
    },
  ]
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);
  document.title = "Hay Storage"


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Hay Storage</h1>
      {
        exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>
    {
      hayQuery.isFetching && <ProgressBar />
    }
    {
      hayQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={hayQuery.data} setExportFn={setExportFn} />
    }
  </>
}
