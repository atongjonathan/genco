import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Button, ButtonGroup, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import FarmersModal from '@/FarmersModal';
import EditForm from '@/EditForm';
import FodderForm from '@/FodderForm';
import DeleteModal from '@/DeleteModal';
import { dateFilterFn } from './capacity-data';
import { useAuth } from '@/AuthContext';

export const Route = createFileRoute('/_authenticated/app/fodder-data')({

  component: RouteComponent,
})



function RouteComponent() {
  const [farmers, setfarmers] = useState<{ [k: string]: any }[] | null>(null);
  const [open, setOpen] = useState(false);

  const [farmopen, setfarmopen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { user } = useAuth()





  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "No.",
      cell: ({ row }: { row: { [k: string]: any } }) => user?.role === "chief-admin" ? (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={FodderForm} row={currentRow} collection='Fodder Farmers' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='Fodder Farmers' />
          <Button variant='danger' onClick={() => {
            setcCurrentRow(row.original)
            setDeleteOpen((prev) => !prev)
          }}>
            <Icon name='interface-delete' label='Delete' />
          </Button>
        </ButtonGroup>
      )
        : `${parseInt(row.id) + 1}.`
    },

    {
      accessorKey: "farmers",
      header: "Farmers",
      cell: ({ row }: { row: { [k: string]: any } }) => {
        return (<>
          {<FarmersModal key={row.id} open={farmopen} setOpen={setfarmopen} farmers={farmers} />}
          <Button onClick={() => {
            setfarmopen((prev) => !prev)
            setfarmers(row.original.farmers)
          }} color='green' disabled={!row.original.farmers?.length}>{row.original.farmers?.length ?? 0}</Button>
        </>)

      }


    },
    {
      accessorKey: "Date",
      header: "Date",
      filterFn: dateFilterFn,
      meta: {
        className: "n-table-ellipsis"
      }
    },
    {
      accessorKey: "location",
      header: "Location"
    },
    {
      accessorKey: "model",
      header: "Model"
    },
    {
      accessorKey: "landSize",
      header: "Land Size"
    },
    {
      accessorKey: "totalAcresPasture",
      header: "Total Acres Under Pasture"
    },
    {
      accessorKey: "totalBales",
      header: "Total Bales harvested"
    },
    {
      accessorKey: "yieldPerHarvest",
      header: "Yield Harvested Per Acre"
    }, {
      accessorKey: "region",
      header: "Region"
    },


  ]

  const fodderQuery = useQuery({
    queryKey: ["fodderQuery"],
    queryFn: () => fetchDataFromCollection("Fodder Farmers"),
    staleTime: Infinity
  })
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  document.title = "Fodder Data"

  const [total, settotal] = useState(0);



  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Fodder Farmers Registration
      {
        total != 0 && <span> {total}</span>
      }
    </h1>

      {
        exportFn && user?.role === "chief-admin" && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }
    </Header>
    { 
      fodderQuery.isFetching && <ProgressBar />
    }
    {
      fodderQuery.data && <DataTable columns={columns} data={fodderQuery.data} setExportFn={setExportFn} onTotalChange={settotal} />
    }

  </>
}


