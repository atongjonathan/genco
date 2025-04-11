import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Header, ProgressBar, Button, Stack, Icon, ButtonGroup } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import BoreholeForm from '@/BoreholeForm';
import DeleteModal from '@/DeleteModal';
import { useAuth } from '@/AuthContext';
export const Route = createFileRoute('/_authenticated/app/borehole')({
  component: RouteComponent,
})

function RouteComponent() {


  const [open, setOpen] = useState(false);

  document.title = "Borehole Storage"


  const [currentRow, setcCurrentRow] = useState<Record<string, any> | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { user } = useAuth()


  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => user?.role === "chief-admin" ? (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={BoreholeForm} row={currentRow} collection='BoreholeStorage' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='BoreholeStorage' />
          <Button variant='danger' onClick={() => {
            setcCurrentRow(row.original)
            setDeleteOpen((prev) => !prev)
          }}>
            <Icon name='interface-delete' label='Delete' />
          </Button>
        </ButtonGroup>

      ) : `${parseInt(row.index) + 1}`
    },
    {
      accessorKey: "Date",
      header: "Date",
      filterFn: dateFilterFn
    },
    {
      accessorKey: "BoreholeLocation",
      header: "Borehole Location"
    },
    {
      accessorKey: "PeopleUsingBorehole",
      header: "No of People Using",
    },

    {
      accessorKey: "WaterUsed",
      header: "Amount of Water Used per week"
    },
    {
      accessorKey: "Region",
      header: "Region"
    },


  ]
  const boreholeQuery = useQuery({
    queryKey: ["boreholeQuery"],
    queryFn: () => fetchDataFromCollection("BoreholeStorage")
  })

  const [total, settotal] = useState(0);
  const [exportFn, setExportFn] = useState<(() => any) | null>(null);


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Borehole</h1>
      {
        exportFn && user?.role === "chief-admin" && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>
    {
      boreholeQuery.isFetching && <ProgressBar />
    }
    {
      boreholeQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={boreholeQuery.data} setExportFn={setExportFn} />
    }
  </>
}

