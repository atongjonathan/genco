import { Header, Select, Stack } from '@nordhealth/react';
import { createFileRoute } from '@tanstack/react-router';
import { Bar, Doughnut } from "react-chartjs-2";
import { ChartData, ChartOptions, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from '@/data';
import Widget from '@/Widget';
import { countFarmersByRegion } from '.';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute('/_authenticated/app/fodder')({
  component: RouteComponent,
});

function countFarmersByGender(data: { [k: string]: any }[]) {
  const maleFarmers = data.filter(item => item.gender?.toLowerCase() === 'male').length;
  const femaleFarmers = data.filter(item => item.gender?.toLowerCase() === 'female').length;
  const Male = data.reduce((sum, item) => sum + (Number(item.males) || 0), 0);
  const Female = data.reduce((sum, item) => sum + (Number(item.females) || 0), 0);
  return { maleFarmers, femaleFarmers, Male, Female };
}

function filterDataByMonth<T extends { dateSubmitted?: string | Date }>(data: T[], month: number): T[] {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid data format");
    return [];

  }


  return data.filter(item => {
    if (!item.Date) return false;

    console.log(item);
    

    const date = new Date(item.Date);
    return date.getMonth() === month;
  });
}

function transformData(data) {
  return data.flatMap(entry =>
    entry.farmers.map(farmer => ({
      ...farmer, ...entry
    }))
  );
}





function RouteComponent() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const [month, setMonth] = useState<number>(currentMonth);


  const fodderQuery = useQuery({
    queryKey: ["fodderQuery"],
    queryFn: () => fetchDataFromCollection("Fodder Farmers"),
    staleTime: Infinity
  });
  document.title = "Fodder Dashboard"

  const [filteredfodder, setfilteredfodder] = useState<{ [k: string]: string }[]>([]);



  // Count farmers by gender
  const { maleFarmers: maleFodderFarmers, femaleFarmers: femaleFodderFarmers } = countFarmersByGender(filteredfodder ?? []);
  const totalFodderFarmers = maleFodderFarmers + femaleFodderFarmers;




  // Prevent division by zero
  const malepercentage1 = totalFodderFarmers > 0 ? ((maleFodderFarmers / totalFodderFarmers) * 100).toFixed(2) : "0.00";
  const femalepercentage1 = totalFodderFarmers > 0 ? ((femaleFodderFarmers / totalFodderFarmers) * 100).toFixed(2) : "0.00";

  const data: ChartData<"doughnut"> = {
    labels: [
      `Male: ${maleFodderFarmers} (${malepercentage1}%)`,
      `Female: ${femaleFodderFarmers} (${femalepercentage1}%)`
    ],
    datasets: [
      {
        label: 'Farmers by Gender',
        data: [maleFodderFarmers, femaleFodderFarmers],
        backgroundColor: ['#4BC0C0', '#FF6384'],
        borderWidth: 1,
      }
    ]
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Fodder Farmers by Gender',
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  const farmersPerRegion = countFarmersByRegion(filteredfodder)

  const barData: ChartData<"bar"> = {
    labels: Object.keys(farmersPerRegion),
    datasets: [
      {
        label: "Number of Farmers",
        data: Object.values(farmersPerRegion),
        backgroundColor: ["#4BC0C0", "#FFCE56", "#FF6384", "#36A2EB", "#9966FF"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: { display: true, text: "Farmers per Region" },
      legend: { position: "bottom" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };
  // const totalFodderFarmers = filteredfodder.length;


  useEffect(() => {
    if (fodderQuery.data) {
      
      setfilteredfodder(transformData(fodderQuery.data))
    }



  }, [fodderQuery.data]);


  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Fodder Dashboard</h1>

      </Header>
      <Stack >
        <Select title="Month" label='Month' hideLabel hint='Current Month' value={month?.toString()} expand onChange={(e) => {
          let element = e.target as HTMLInputElement
          let value = element.value
          let month = parseInt(value)
          setMonth(month)

        let fullData = transformData(fodderQuery.data)

          const newData = filterDataByMonth(fullData, month)
          setfilteredfodder(newData)
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


        <Stack direction="horizontal" gap="l">
          <Widget title='Fodder Farmers' value={filteredfodder.length} />
        </Stack>      </Stack>
      <section className="n-stack n-grid-2">
        <div>
          <Doughnut width={30} data={data} options={options} />
        </div>
        <div>
        {Object.keys(farmersPerRegion).length > 0 ? <Bar data={barData} options={barOptions} /> : <p>No regional data available.</p>}

        </div>
      </section>
    </>

  );
}
