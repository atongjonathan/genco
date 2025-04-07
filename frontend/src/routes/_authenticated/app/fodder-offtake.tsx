import { createFileRoute } from '@tanstack/react-router'
import { fetchDataFromCollection } from '@/data';
import { DataTable } from '@/TanstackTable';
import { Button, ButtonGroup, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import FodderOftakeForm from '@/FodderOftakeForm';
import DeleteModal from '@/DeleteModal';
import { useAuth } from '@/AuthContext';

export const Route = createFileRoute('/_authenticated/app/fodder-offtake')({
  component: RouteComponent,
})

function RouteComponent() {
  const fodderOfftakeQuery = useQuery({
    queryKey: ["fodderOfftakeQuery"],
    queryFn: () => fetchDataFromCollection("Fodder Offtake Data"),
    staleTime: Infinity
  })




  const [open, setOpen] = useState(false);
  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { user } = useAuth()


  document.title = "Fodder Offtake Data"



  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => user?.role === "chief-admin" ? (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={FodderOftakeForm} row={currentRow} collection='Fodder Offtake Data' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='Fodder Offtake Data' />
          <Button variant='danger' onClick={() => {
            setcCurrentRow(row.original)
            setDeleteOpen((prev) => !prev)
          }}>
            <Icon name='interface-delete' label='Delete' />
          </Button>
        </ButtonGroup>
        
      )  : `${parseInt(row.id) + 1}.`
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
    {
      accessorKey: "balePrice",
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

  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Fodder Offtake</h1>
      {
        exportFn && user?.role === "chief-admin" && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>
    {
      fodderOfftakeQuery.isFetching && <ProgressBar />
    }
    {
      fodderOfftakeQuery.data && <DataTable columns={columns} data={fodderOfftakeQuery.data} setExportFn={setExportFn} />
    }
  </>
}
