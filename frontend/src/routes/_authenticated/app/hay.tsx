import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Header, ProgressBar, Button, Stack, Icon, ButtonGroup } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import EditForm from '@/EditForm';
import HayForm from '@/HayForm';
import DeleteModal from '@/DeleteModal';
import { useAuth } from '@/AuthContext';

export const Route = createFileRoute(
  '/_authenticated/app/hay',
)({
  component: RouteComponent,
})



function RouteComponent() {

  const [open, setOpen] = useState(false);



  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { user } = useAuth()


  const hayQuery = useQuery({
    queryKey: ["hayQuery"],
    queryFn: () => fetchDataFromCollection("HayStorage")
  })
  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => user?.role === "chief-admin" ? (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={HayForm} row={currentRow} collection='HayStorage' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='HayStorage' />
          <Button variant='danger' onClick={() => {
            setcCurrentRow(row.original)
            setDeleteOpen((prev) => !prev)
          }}>
            <Icon name='interface-delete' label='Delete' />
          </Button>
        </ButtonGroup>
      ) : `${parseInt(row.id) + 1}.`
    },
    {
      accessorKey: "Date",
      header: "Date",
      meta: {
        className: "n-table-ellipsis"
      }
    },
    {
      accessorKey: "HayStorageFacility",
      header: "Facility"
    },
    {
      accessorKey: "BalesSold",
      header: "Bales Sold"
    },
    {
      accessorKey: "BalesStored",
      header: "Bales Stored"
    },
    {
      accessorKey: "BalesSize",
      header: "Bales Balance"
    },
    {
      accessorKey: "RevenueFromSales",
      header: "Revenue From Sales"
    },
    {
      accessorKey: "Region",
      header: "Region"
    },

  ]

  const [exportFn, setExportFn] = useState<(() => void) | null>(null);
  document.title = "Hay Storage"


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Hay Storage</h1>
      {
        exportFn && user?.role === "chief-admin" && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>
    {
      hayQuery.isFetching && <ProgressBar />
    }
    {
      hayQuery.data && <DataTable columns={columns} data={hayQuery.data} setExportFn={setExportFn} />
    }
  </>
}
