import { Card, Header, ProgressBar, Select, Stack, Table } from "@nordhealth/react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import Widget from "@/Widget";
import { FarmerRecord, GOTChart } from "@/GOTChart";
import { useQuery } from "@tanstack/react-query";
import { fetchDataFromCollection } from "@/data";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Route = createFileRoute("/_authenticated/app/")({
  component: RouteComponent,
});

// 🟢 Count farmers by gender efficiently
function countFarmersByGender(data: FarmerRecord[]) {
  return data.reduce(
    (acc, item) => {
      const gender = item.gender?.toLowerCase();
      if (gender === "male") acc.maleLivestockFarmers++;
      if (gender === "female") acc.femaleLivestockFarmers++;

      acc.malesLivestock += Number(item.maleGoats) || 0;
      acc.femalesLivestock += Number(item.femaleGoats) || 0;
      return acc;
    },
    { maleLivestockFarmers: 0, femaleLivestockFarmers: 0, malesLivestock: 0, femalesLivestock: 0 }
  );
}

// 🟢 Count farmers per region
export function countFarmersByRegion(data: FarmerRecord[]) {
  return data.reduce((acc, item) => {
    const region = item.region || "Unknown";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// 🟢 Filter data by month
function filterDataByMonth<T extends { dateSubmitted?: string | Date }>(data: T[], month: number): T[] {
  return data.filter(item => {
    if (!item.dateSubmitted) return false;
    return new Date(item.dateSubmitted).getMonth() === month;
  });
}

// 📌 Route Component
function RouteComponent() {
  document.title = "Dashboard";

  const currentMonth = new Date().getMonth();
  const [month, setMonth] = useState<number>(currentMonth);
  const [filteredLivestock, setFilteredLivestock] = useState<FarmerRecord[]>([]);

  const livestockQuery = useQuery({
    queryKey: ["livestockQuery"],
    queryFn: () => fetchDataFromCollection("Livestock Farmers"),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (livestockQuery.data) {
      setFilteredLivestock(filterDataByMonth(livestockQuery.data, month));
    }
  }, [livestockQuery.data, month]);

  // Compute farmer statistics
  const totalLivestockFarmers = filteredLivestock.length;
  const { maleLivestockFarmers, femaleLivestockFarmers, malesLivestock, femalesLivestock } = countFarmersByGender(filteredLivestock);
  const malePercentage = ((maleLivestockFarmers / totalLivestockFarmers) * 100 || 0).toFixed(2);
  const femalePercentage = ((femaleLivestockFarmers / totalLivestockFarmers) * 100 || 0).toFixed(2);
  const totalGoats = malesLivestock + femalesLivestock;



  // 🟢 Gender Distribution Chart Data
  const genderData: ChartData<"doughnut"> = {
    labels: [`Male: ${maleLivestockFarmers} (${malePercentage}%)`, `Female: ${femaleLivestockFarmers} (${femalePercentage}%)`],
    datasets: [
      {
        data: [maleLivestockFarmers, femaleLivestockFarmers],
        backgroundColor: ["#0000FF", "orange"],
        borderWidth: 1,
      },
    ],
  };

  const genderOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Livestock Farmers By Gender" },
      legend: { position: "bottom" },
    },
    aspectRatio: 1.6,
  };

  // 🟢 Farmers per Region Chart Data
  const farmersPerRegion = countFarmersByRegion(filteredLivestock);
  const officers = {
    "Samburu North": "Lobuk J",
    "Samburu East A": "Jonez",
    "Samburu East B": "Perialo"
  }
  const farmers = Object.values(farmersPerRegion)
  const tableData = Object.keys(farmersPerRegion).map((region, idx) => {

    let data = {}    
    data["Region"] = region
    data["Field Officer"] = officers[region.trim()]
    data["Registered Farmers"] = farmers[idx]
    data["Balance"] = farmers[idx] - 117
    data["Target Met"] = farmers[idx] >= 117 ? "Yes" : "No"

    return data

  })

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

  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Livestock Dashboard</h1>
      </Header>

      {livestockQuery.isFetching && <ProgressBar />}

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
            if (livestockQuery.data) {
              setFilteredLivestock(filterDataByMonth(livestockQuery.data, selectedMonth));
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
          <Widget title="Livestock Farmers" value={totalLivestockFarmers} />
          <Widget title="Total Goats" value={totalGoats} />
        </Stack>

        {/* 📌 Charts Section */}
        <section className="n-grid-2">
          <div className="h-60">
            {totalLivestockFarmers > 0 ? <Doughnut data={genderData} options={genderOptions} /> : <p>No data available.</p>}
          </div>
          <div className="h-72">
            <GOTChart filteredLivestock={filteredLivestock} />
          </div>


        </section>
        <section className="flex items-center gap-5">
          <div>
            {Object.keys(farmersPerRegion).length > 0 ? <Bar data={barData} options={barOptions} className="n-border n-border-radius p-3" /> : <p>No regional data available.</p>}

          </div>
          {
            tableData.length > 0 && (
              <Card padding="xs">
                <Table >
                  <table>
                    <tr>
                      {
                        Object.keys(tableData[0]).map((header) => (<th className="n-table-align-right">{header}</th>))
                      }

                    </tr>
                    {
                      tableData.map((data) => (
                        <tr>
                          {
                            Object.values(data).map((value) => (
                              <td className="text-center">{value}</td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </table>
                </Table>
              </Card>
            )
          }
        </section>

      </Stack>
    </>
  );
}
