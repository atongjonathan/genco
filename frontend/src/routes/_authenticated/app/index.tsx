import { Header, ProgressBar, Select, Stack } from '@nordhealth/react';
import { createFileRoute } from '@tanstack/react-router'
import { Doughnut } from 'react-chartjs-2';
// import { livestockData } from "../../../../livestock-data"
import type { ChartData, ChartOptions } from 'chart.js';
import "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import Widget from '@/Widget';
import { FarmerRecord, GOTChart } from '@/GOTChart';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from '@/data';


// import { Chart as ChartJS } from 'chart.js/auto'
ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute('/_authenticated/app/')({
  component: RouteComponent,
})

function countFarmersByGender(data: FarmerRecord[]) {
  if (!Array.isArray(data)) {
    console.error("Invalid data format");
    return { maleLivestockFarmers: 0, femaleLivestockFarmers: 0, malesLivestock: 0, femalesLivestock: 0 };
  }

  let maleLivestockFarmers = 0;
  let femaleLivestockFarmers = 0;
  let malesLivestock = 0;
  let femalesLivestock = 0;

  for (const item of data) {
    // Count based on gender field
    if (item.gender) {
      const genderLower = item.gender.toLowerCase();
      if (genderLower === "male") maleLivestockFarmers++;
      if (genderLower === "female") femaleLivestockFarmers++;
    }

    // Sum up male and female goats
    malesLivestock += Number(item.maleGoats) || 0;
    femalesLivestock += Number(item.femaleGoats) || 0;
  }

  return { maleLivestockFarmers, femaleLivestockFarmers, malesLivestock, femalesLivestock };
}

function filterDataByMonth<T extends { dateSubmitted?: string | Date }>(data: T[], month: number): T[] {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data format");
    return [];
  }
  return data.filter(item => {
    if (!item.dateSubmitted) return false;
    const date = new Date(item.dateSubmitted);
    return date.getMonth() === month;
  });
}

// type Months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
function RouteComponent() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const [month, setMonth] = useState<number>(currentMonth);

  // const filteredLivestock = 
  document.title = "Dashboard"

  // console.log(filteredLivestock);
  const livestockQuery = useQuery({
    queryKey: ["livestockQuery"],
    queryFn: () => fetchDataFromCollection("Livestock Farmers"),
    staleTime:Infinity
  })

  console.log(livestockQuery.data?.length);
  

  const [filteredLivestock, setfilteredLivestock] = useState<FarmerRecord[]>([]);



  // const malepercentage1 = ((maleFodderFarmers / totalFodderFarmers) * 100).toFixed(2);
  // const femalepercentge1 = ((femaleFodderFarmers / totalFodderFarmers) * 100).toFixed(2);
  const totalLivestockFarmers = filteredLivestock.length;
  const { maleLivestockFarmers, femaleLivestockFarmers, malesLivestock, femalesLivestock } = countFarmersByGender(filteredLivestock);
  const malepercentage = ((femalesLivestock / totalLivestockFarmers) * 100).toFixed(2);
  const femalepercentge = ((femaleLivestockFarmers / totalLivestockFarmers) * 100).toFixed(2);

  // const totalLivestockFarmers = filteredLivestock.length;
  // const totalFodderFarmers = maleFodderFarmers + femaleFodderFarmers;
  // const farmerstrained = malesCapacity + femalesCapacity;
  const totalGoats = filteredLivestock.reduce((sum, item) => {
    const maleGoats = Number(item.maleGoats) || 0;
    const femaleGoats = Number(item.femaleGoats) || 0;
    return sum + maleGoats + femaleGoats;
  }, 0);

  const data: ChartData = {
    labels: [
      `Male: ${maleLivestockFarmers}   ${malepercentage}%  `,
      `Female : ${femaleLivestockFarmers}   ${femalepercentge}%`,
    ],
    datasets: [
      {
        data: [maleLivestockFarmers, femaleLivestockFarmers],
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
    if (livestockQuery.data) {
      // console.log("Original data:", livestockQuery.data);
  
      // Always filter from the original fetched data
      const filtered = filterDataByMonth(livestockQuery.data, month);
      console.log(filtered);
      
      // console.log("Filtered data:", filtered);
  
      setfilteredLivestock(filtered);
    }
  }, [livestockQuery.data, month]); // Add 'month' to dependency array
  
  return <>
    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Livestock Dashboard</h1>


    </Header>
    {
      livestockQuery.isFetching && <ProgressBar />
    }
    <Stack>
      <Select title="Month" label='Month' hideLabel hint='Current Month' value={month.toString()} expand onChange={(e) => {
        let element = e.target as HTMLInputElement
        let value = element.value
        let month = parseInt(value)
        setMonth(month)
        
        const newData = filterDataByMonth(filteredLivestock, month)
        console.log(newData.length, filteredLivestock.length);
        setfilteredLivestock(newData)
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

        <Widget title='Livestock Farmers' value={totalLivestockFarmers} />
        <Widget title='Total Goats No' value={totalGoats} />
        {/* <Widget title='Total Farmers Trained' value={totalLivestockFarmers} /> */}
      </Stack>

      <section className="n-grid-2">
        <div>
          <Doughnut width={30} data={data} options={options} />

        </div>
        <div>
          <GOTChart filteredLivestock={filteredLivestock} />

        </div>

      </section>
    </Stack>



  </>
}
