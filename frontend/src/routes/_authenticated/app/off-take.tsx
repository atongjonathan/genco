import { fetchDataFromCollection, signin } from '@/data';
import { createFileRoute, useLocation, useNavigate, useRouteContext } from '@tanstack/react-router'
import { Table as TTable } from "@tanstack/table-core"

import { DataTable } from '@/TanstackTable';
import { Button, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import FarmersModal from '@/FarmersModal';
import { dateFilterFn } from './capacity-data';
import OfftakeModal from '@/OfftakeModal';
export const Route = createFileRoute('/_authenticated/app/off-take')({
  component: RouteComponent,
})

type Weight = {
  liveWeight: string[],
  carcassWeight: string[]
}

function RouteComponent() {

  const offtakeQuery = useQuery({
    queryKey: ["offtakeQuery"],
    queryFn: () => fetchDataFromCollection("Livestock Offtake Data"),
    staleTime: Infinity
  })

  console.log(offtakeQuery.data);

  const [open, setopen] = useState(false);

  const [weight, setWeight] = useState<Weight | null>(null);

  document.title = "Offtake Data"

  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (<Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
        <Button color='green' ><Icon name='interface-edit' /></Button>
        {row.index + 1}
      </Stack>), // Row number starts from 1
    },
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
   ,
    {
      accessorKey: "location",
      header: "Location"
    },
    
    {
      accessorKey: "region",
      header: "Region"
    },
       {
      accessorKey: "noSheepGoats",
      header: "sheepGoats No",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <>
          <OfftakeModal open={open} setOpen={setopen} weight={weight} />
          <Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
            <Button color='green' onClick={() => {
              setopen((prev) => !prev)
              setWeight({
                carcassWeight: row.original.carcassWeight,
                liveWeight: row.original.liveWeight
              })
            }}>  {row.original.noSheepGoats}</Button>

          </Stack>
        </>

      ), // Row number starts from 1
    },
    {
      accessorKey: "sheepGoatPrice",
      header: "Total Price",
      cell: (({ row }) => row.original.sheepGoatPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    }
  ]

  const [total, settotal] = useState(0);
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);


  return (
    <>
      <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Offtake</h1>
        {
          exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
        }</Header>
      {
        offtakeQuery.isFetching && <ProgressBar />
      }
      {
        offtakeQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={offtakeQuery.data} setExportFn={setExportFn} />
      }
    </>
  )
}

