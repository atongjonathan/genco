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

export const Route = createFileRoute('/_authenticated/app/fodder-data')({

  component: RouteComponent,
})



function RouteComponent() {
  const [farmers, setfarmers] = useState<{ [k: string]: any }[] | null>(null);
  const [open, setOpen] = useState(false);

  const [farmopen, setfarmopen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  

  

  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (
        <ButtonGroup variant='spaced'>
        <EditForm open={open} setOpen={setOpen} FormComponent={FodderForm} row={currentRow} collection='FodderFarmers' />

        <Button onClick={() => {
          setOpen((prev) => !prev)
          
          setcCurrentRow(row)
        }}>
          <Icon name='interface-edit' label='Edit' />
        </Button>
        <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='FodderFarmers' />
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
    // {
    //   accessorKey: "totalAcresPastures",
    //   header: "Total Acres Under Pasture"
    // },
    {
      accessorKey: "totalBales",
      header: "Total bales harvested"
    },
    {
      accessorKey: "yieldPerHarvest",
      header: "Yield per Harvest"
    }, {
      accessorKey: "region",
      header: "Region"
    },


  ]

  const fodderQuery = useQuery({
    queryKey: ["fodderQuery"],
    queryFn: () => fetchDataFromCollection("FodderFarmers"),
    staleTime: Infinity
  })
  const [exportFn, setExportFn] = useState<(()=>void) | null>(null);

  document.title = "Fodder Data"


  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Fodder Farmers Registration</h1>
    {
  exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
}
    </Header>
    {
      fodderQuery.isFetching && <ProgressBar />
    }
    {
      fodderQuery.data && <DataTable columns={columns} data={fodderQuery.data} setExportFn={setExportFn} />
    }

  </>
}


