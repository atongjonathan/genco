import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Button, ButtonGroup, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { dateFilterFn } from './capacity-data';
import OfftakeModal from '@/OfftakeModal';
import EditForm from '@/EditForm';
import OfftakeForm from '@/OfftakeForm';
import DeleteModal from '@/DeleteModal';
export const Route = createFileRoute('/_authenticated/app/off-take')({
  component: RouteComponent,
})

type Weight = {
  liveWeight: string[],
  carcassWeight: string[],
  pricePerGoatAndSheep: string[],
}

function RouteComponent() {

  const offtakeQuery = useQuery({
    queryKey: ["offtakeQuery"],
    queryFn: () => fetchDataFromCollection("Livestock Offtake Data"),
    staleTime: Infinity
  })





  const [offtakeopen, setofftakeopen] = useState(false);

  const [weight, setWeight] = useState<Weight | null>(null);
  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  document.title = "Offtake Data"

  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={OfftakeForm} row={currentRow} collection='Livestock Offtake Data' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='Livestock Offtake Data' />
          <Button variant='danger' onClick={() => {
            setcCurrentRow(row.original)
            setDeleteOpen((prev) => !prev)
          }}>
            <Icon name='interface-delete' label='Delete' />
          </Button>
        </ButtonGroup>
      )
    },
    {
      accessorKey: "date",
      header: "Date",
      filterFn: dateFilterFn

    },
    {
      accessorKey: "farmerName",
      header: "Farmer Name",
      meta: {
        className: "n-table-ellipsis"
      }
    },
    {
      accessorKey: "gender",
      header: "Gender"
    },
    {
      accessorKey: "idNumber",
      header: "ID No"
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
          <OfftakeModal open={offtakeopen} setOpen={setofftakeopen} weight={weight} />
          <Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
            <Button color='green' onClick={() => {
              setofftakeopen((prev) => !prev)
              setWeight({
                carcassWeight: row.original.carcassWeight,
                liveWeight: row.original.liveWeight,
                pricePerGoatAndSheep: row.original.pricePerGoatAndSheep,
              })
            }}>  {row.original.noSheepGoats}</Button>

          </Stack>
        </>

      ), // Row number starts from 1
    },
    {
      accessorKey: "sheepGoatPrice",
      header: "Total Price",
      cell: (({ row }) => (row.original as any).sheepGoatPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    }
  ]

  const [total, settotal] = useState(0);
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);


  return (
    <>

      <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Offtake  {
        total != 0 && <span>| {total}</span>
      } </h1>
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

