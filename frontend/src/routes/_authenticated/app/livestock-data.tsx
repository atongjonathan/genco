import { fetchDataFromCollection, signin } from '@/data';
import { createFileRoute, useLocation, useNavigate, useRouteContext } from '@tanstack/react-router'
import { Table as TTable } from "@tanstack/table-core"

import { livestockData } from "../../../../livestock-data"
import { DataTable } from '@/TanstackTable';
import { Button, Header, Icon, ProgressBar, Stack } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmerRecord } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import EditLivestock from '@/EditForm';

export const Route = createFileRoute('/_authenticated/app/livestock-data')({

  component: RouteComponent,
})

const dateFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  if (!rowValue) return false;

  const rowDate = new Date(rowValue).getTime(); // Convert row value to timestamp
  const [startDate, endDate] = filterValue.map(date => new Date(date).getTime());

  if (!startDate && !endDate) return true; // No filters applied
  if (startDate && rowDate <= startDate) return false; // Before start date
  if (endDate && rowDate >= endDate) return false; // After end date

  return true;
};


function RouteComponent() {
  const [open, setOpen] = useState<boolean>(false);

  const columns: ColumnDef<FarmerRecord>[] = [
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }: { row: { [k: string]: any } }) => (<Stack direction='horizontal' alignItems='center' justifyContent='start' className='text-center'>
        {/* <Button onClick={() => {
                setOpen((prev) => !prev)
            }} color='green'><Icon name='interface-edit'/></Button>
            <EditLivestock open={open} setOpen={setOpen} row={row} collection='Livestock Farmers'/> */}
        {row.index + 1}
      </Stack>), // Row number starts from 1
    },
    {
      accessorKey: "dateSubmitted",
      header: "Date",
      filterFn: dateFilterFn 

    },
    {
      accessorKey: "name",
      header: "Farmer Name"
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

  const [exportFn, setExportFn] = useState<(()=>void) | null>(null);
  


  

  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Farmers</h1>
    <h1 slot='end'>Total Goats:  <span className='n-typescale-l'>{total}</span> </h1>

{
  exportFn && <Button onClick={exportFn} variant='primary' slot='end'>Export </Button>
}
    

    </Header>
    {
      livestockQuery.isFetching && <ProgressBar />
    }
    {
      livestockQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={livestockQuery.data} setExportFn={setExportFn} />
    }

  </>
}


