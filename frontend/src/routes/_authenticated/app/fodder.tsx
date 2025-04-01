import { Header, Stack } from '@nordhealth/react';
import { createFileRoute } from '@tanstack/react-router';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from '@/data';
import Widget from '@/Widget';

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

function RouteComponent() {
  const fodderQuery = useQuery({
    queryKey: ["fodderQuery"],
    queryFn: () => fetchDataFromCollection("FodderFarmers"),
    staleTime: Infinity
  });
  document.title = "Fodder Dashboard"

  const [filteredfodder, setfilteredfodder] = useState<{ [k: string]: string }[]>([]);

  useEffect(() => {
    if (fodderQuery.data) {
      setfilteredfodder(fodderQuery.data ?? []); // Ensure it's always an array
    }
  }, [fodderQuery.data]);

  // Count farmers by gender
  const { maleFarmers: maleFodderFarmers, femaleFarmers: femaleFodderFarmers } = countFarmersByGender(filteredfodder);
  const totalFodderFarmers = maleFodderFarmers + femaleFodderFarmers;

  console.log(maleFodderFarmers);
  

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


  useEffect(() => {
    if(fodderQuery.data)
      setfilteredfodder(fodderQuery.data)
  
  }, []);


  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Fodder Dashboard</h1>

      </Header>
      <Stack className="stack" direction="horizontal" gap="l">

        <Widget title='Fodder Farmers' value={filteredfodder.length} />
      </Stack>
      <section className="n-grid-2">
        <div>
          <Doughnut width={30} data={data} options={options} />
        </div>
      </section>
    </>

  );
}
