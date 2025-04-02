import { createFileRoute } from '@tanstack/react-router'
import { Header, ProgressBar, Select, Stack } from '@nordhealth/react';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from '@/data';
import Widget from '@/Widget';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute('/_authenticated/app/capacity')({
  component: RouteComponent,
})

function countFarmersByGender(data: Record<string, any>) {
  if (!Array.isArray(data)) {
    console.error("Invalid data format");
    return { maleFarmers: 0, femaleFarmers: 0 };
  }

  let maleFarmers = 0;
  let femaleFarmers = 0;


  for (const item of data) {
    
    // console.log(item);
    // Count based on gender field
    if (item.Gender) {
      
      const genderLower = item.Gender.toLowerCase();
      if (genderLower === "male") maleFarmers++;
      if (genderLower === "female") femaleFarmers++;
    }

  }

  return { maleFarmers, femaleFarmers };
}
function filterDataByMonth<T extends { dateSubmitted?: string | Date }>(data: T[], month: number): T[] {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data format");
    return [];
  }
  return data.filter(item => {
    if (!item.date) return false;
    const date = new Date(item.date);
    
    return date.getMonth() === month;
  });
}
function RouteComponent() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const [month, setMonth] = useState<number>(currentMonth);
  const capacityQuery = useQuery({
    queryKey: ["capacityQuery"],
    queryFn: () => fetchDataFromCollection("Capacity Building")
  })

  const [filteredCapacity, setfilteredCapacity] = useState<Record<string, any>[]>([]);


  const totalLivestockFarmers = filteredCapacity?.length
  const { maleFarmers, femaleFarmers, malesLivestock, femalesLivestock } = countFarmersByGender(filteredCapacity);
  
  const malepercentage = ((maleFarmers / totalLivestockFarmers) * 100).toFixed(2);
  const femalepercentge = ((femaleFarmers / totalLivestockFarmers) * 100).toFixed(2);

  

  useEffect(() => {
    console.log(malepercentage);
    
  
    return () => {
      
    }
  }, [malepercentage]);

  // const totalLivestockFarmers = filteredLivestock.length;
  // const totalFodderFarmers = maleFodderFarmers + femaleFodderFarmers;
  // const farmerstrained = malesCapacity + femalesCapacity;
  const totalGoats = filteredCapacity.reduce((sum, item) => {
    const maleGoats = Number(item.maleGoats) || 0;
    const femaleGoats = Number(item.femaleGoats) || 0;
    return sum + maleGoats + femaleGoats;
  }, 0);

  const data: ChartData = {
    labels: [
      `Male: ${maleFarmers}   ${malepercentage}%  `,
      `Female : ${femaleFarmers}   ${femalepercentge}%`,
    ],  
    datasets: [
      {
        data: [maleFarmers, femaleFarmers],
        backgroundColor: ['#0000FF', 'orange'],
        borderWidth: 1,
      }
    ]
  }
  const options: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Livestock Farmers By Gender',
      },
      legend: {
        position: 'bottom',
      },
    },
    aspectRatio: 1.6,
  }




  useEffect(() => {
    if (capacityQuery.data) {
      // console.log("Original data:", livestockQuery.data);
  
      // Always filter from the original fetched data
      const filtered = filterDataByMonth(capacityQuery.data, month);      

        
      setfilteredCapacity(filtered);
    }
  }, [capacityQuery.data, month]); // Add 'month' to dependency array

  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Capacity Dashboard</h1>


    </Header>
    {
      capacityQuery.isFetching && <ProgressBar />
    }
    <Stack>
      <Select title="Month" label='Month' hideLabel hint='Current Month' value={month.toString()} expand onChange={(e) => {
        let element = e.target as HTMLInputElement
        let value = element.value
        let month = parseInt(value)
        setMonth(month)

        const newData = filterDataByMonth(filteredCapacity, month)
        console.log(newData);
        
        
        setfilteredCapacity(newData)
      }}>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6">July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>

      </Select>
      <Stack className="stack" direction="horizontal" gap="l">

        <Widget title='Farmers' value={totalLivestockFarmers} />

      </Stack>
      
      <section className="n-grid-2">
        <div>
          {
            data &&  <Doughnut width={30} data={data} options={options} />
          }
         

        </div>
        <div>
          {/* <GOTChart filteredLivestock={filteredLivestock} /> */}

        </div>

      </section>
    </Stack>

  </>
}
