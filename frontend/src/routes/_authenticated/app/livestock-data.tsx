import { fetchDataFromCollection } from '@/data';
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/TanstackTable';
import { Button, ButtonGroup, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { dateFilterFn } from './capacity-data';
import EditForm from '@/EditForm';
import DeleteModal from '@/DeleteModal';
import LivestockForm from '@/LivestockForm';
import { useAuth } from '@/AuthContext';

export const Route = createFileRoute('/_authenticated/app/livestock-data')({

  component: RouteComponent,
})




function RouteComponent() {
  const [open, setOpen] = useState<boolean>(false);

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { user } = useAuth()



  const [currentRow, setcCurrentRow] = useState<{ [k: string]: any } | null>(null);
  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => user?.role === "chief-admin" ? (
        <ButtonGroup variant='spaced'>
          <EditForm open={open} setOpen={setOpen} FormComponent={LivestockForm} row={currentRow} collection='Livestock Farmers' />

          <Button onClick={() => {
            setOpen((prev) => !prev)

            setcCurrentRow(row)
          }}>
            <Icon name='interface-edit' label='Edit' />
          </Button>
          <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={currentRow} collection='Livestock Farmers' />
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
      accessorKey: "dateSubmitted",
      header: "Date",
      filterFn: dateFilterFn

    },
    {
      accessorKey: "name",
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
      accessorKey: "idNo",
      header: "ID"
    },
    {
      accessorKey: "phoneNo",
      header: "Phone"
    },
    {
      accessorKey: "location",
      header: "Location"
    },
    {
      accessorKey: "maleGoats",
      header: "Male Goats"
    },
    {
      accessorKey: "femaleGoats",
      header: "Female Goats"
    },
    {
      accessorKey: "rangeFirst",
      header: "0-3 mths"
    },
    {
      accessorKey: "rangeSecond",
      header: "3-6 mths"
    },
    {
      accessorKey: "rangeThird",
      header: "6-9 mths"
    },
    {
      accessorKey: "rangeFourth",
      header: "9-12 mths+"
    },
    {
      accessorKey: "Weight1",
      header: "14kgs"
    },
    {
      accessorKey: "Weight2",
      header: "15kgs	"
    },
    {
      accessorKey: "Weight3",
      header: "16-17kgs"
    },
    {
      accessorKey: "Weight4",
      header: "18-19kgs"
    },
    {
      accessorKey: "Weight5",
      header: "20kgs"
    },
    {
      accessorKey: "Weight6",
      header: "21kgs"
    },
    {
      accessorKey: "Weight7",
      header: "22kgs and ^"
    },
    {
      accessorKey: "vaccineType",
      header: "Vaccine Type"
    },
    {
      accessorKey: "vaccineDate",
      header: "Date Administ.",
      filterFn: dateFilterFn

    },
    {
      accessorKey: "dewormingSchedule",
      header: "Deworming D",
      filterFn: dateFilterFn

    },
    {
      accessorKey: "dippingDate",
      header: "Dipping date",
      filterFn: dateFilterFn

    },
    {
      accessorKey: "newBreedMale",
      header: "NBs(Male)s"
    },
    {
      accessorKey: "newBreedFemales",
      header: "NBs(Female)s"
    },
    {
      accessorKey: "newBreedYoung",
      header: "NBs(Young)"
    },
    {
      accessorKey: "traceability",
      header: "Traceability"
    },
    {
      accessorKey: "region",
      header: "Region"
    }

  ]

  const livestockQuery = useQuery({
    queryKey: ["livestockQuery"],
    queryFn: () => fetchDataFromCollection("Livestock Farmers")
  })

  document.title = "Livestock Data"

  const [total, settotal] = useState(0);

  const [exportFn, setExportFn] = useState<(() => void) | null>(null);





  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Farmers {
      total != 0 && <span>{total}</span>
    } </h1>
      {
        exportFn && user?.role === "chief-admin" && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
      }</Header>

    {
      livestockQuery.isFetching && <ProgressBar />
    }
    {
      livestockQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={livestockQuery.data} setExportFn={setExportFn} />
    }

  </>
}


