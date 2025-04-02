import { createFileRoute } from "@tanstack/react-router";
import { Header, ProgressBar, Select, Stack } from "@nordhealth/react";
import { Doughnut, Bar } from "react-chartjs-2";
import { 
  ChartData, 
  ChartOptions, 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from "chart.js";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDataFromCollection } from "@/data";
import Widget from "@/Widget";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const Route = createFileRoute("/_authenticated/app/capacity")({
  component: RouteComponent,
});

// 🟢 Helper: Count farmers by gender
function countFarmersByGender(data: Record<string, any>[]) {
  return data.reduce(
    (acc, item) => {
      const gender = item.Gender?.toLowerCase();
      if (gender === "male") acc.maleFarmers++;
      if (gender === "female") acc.femaleFarmers++;
      return acc;
    },
    { maleFarmers: 0, femaleFarmers: 0 }
  );
}

// 🟢 Helper: Aggregate farmers by region
function countFarmersByRegion(data: Record<string, any>[]) {
  return data.reduce((acc, item) => {
    const region = item.region?.trim() || "Unknown";  // Handle missing or empty regions
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// 🟢 Helper: Filter data by selected month
function filterDataByMonth<T extends { date?: string | Date }>(data: T[], month: number): T[] {
  return data.filter(item => {
    if (!item.date) return false;
    return new Date(item.date).getMonth() === month;
  });
}

// 📌 Route Component
function RouteComponent() {
  document.title = "Capacity Dashboard";

  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState<number>(currentMonth);
  const [filteredCapacity, setFilteredCapacity] = useState<Record<string, any>[]>([]);

  // 🔄 Fetch Capacity Data
  const capacityQuery = useQuery({
    queryKey: ["capacityQuery"],
    queryFn: () => fetchDataFromCollection("Capacity Building"),
    staleTime: Infinity,
  });

  // ⏳ Update filtered data when capacity data changes
  useEffect(() => {
    if (capacityQuery.data) {
      setFilteredCapacity(filterDataByMonth(capacityQuery.data, month));
    }
  }, [capacityQuery.data, month]);

  // 📊 Compute Stats
  const totalFarmers = filteredCapacity.length;
  const { maleFarmers, femaleFarmers } = countFarmersByGender(filteredCapacity);
  const malePercentage = ((maleFarmers / totalFarmers) * 100 || 0).toFixed(2);
  const femalePercentage = ((femaleFarmers / totalFarmers) * 100 || 0).toFixed(2);

  // 📊 Gender Distribution Chart Data
  const genderData: ChartData<"doughnut"> = {
    labels: [`Male: ${maleFarmers} (${malePercentage}%)`, `Female: ${femaleFarmers} (${femalePercentage}%)`],
    datasets: [
      {
        data: [maleFarmers, femaleFarmers],
        backgroundColor: ["#0000FF", "orange"],
        borderWidth: 1,
      },
    ],
  };

  const genderOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Farmers By Gender" },
      legend: { position: "bottom" },
    },
    aspectRatio: 1.6,
  };

  // 📊 Farmers Per Region Chart Data
  const farmersPerRegion = countFarmersByRegion(filteredCapacity);
  const regionLabels = Object.keys(farmersPerRegion);
  const regionCounts = Object.values(farmersPerRegion);

  const regionData: ChartData<"bar"> = {
    labels: regionLabels,
    datasets: [
      {
        label: "Number of Farmers",
        data: regionCounts,
        backgroundColor: ["#4BC0C0", "#FFCE56", "#FF6384", "#36A2EB", "#9966FF"], // 🟢 Your original colors
        borderWidth: 1,
      },
    ],
  };
  

  const regionOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: { display: true, text: "Farmers Per Region" },
      legend: { position: "bottom" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Capacity Dashboard</h1>
      </Header>

      {capacityQuery.isFetching && <ProgressBar />}

      <Stack>
        {/* 📌 Month Selection */}
        <Select
          title="Month"
          label="Month"
          hideLabel
          hint="Current Month"
          value={month.toString()}
          expand
          onChange={(e) => {
            const selectedMonth = parseInt(e.target.value);
            setMonth(selectedMonth);
            if (capacityQuery.data) {
              setFilteredCapacity(filterDataByMonth(capacityQuery.data, selectedMonth));
            }
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </Select>

        {/* 📌 Widgets */}
        <Stack className="stack" direction="horizontal" gap="l">
          <Widget title="Total Farmers" value={totalFarmers} />
        </Stack>

        {/* 📌 Charts Section */}
        <section className="n-grid-2">
          <div>
            {totalFarmers > 0 ? <Doughnut data={genderData} options={genderOptions} /> : <p>No data available.</p>}
          </div>
          <div>
            {totalFarmers > 0 ? <Bar data={regionData} options={regionOptions} /> : <p>No data available.</p>}
          </div>
        </section>
      </Stack>
    </>
  );
}
