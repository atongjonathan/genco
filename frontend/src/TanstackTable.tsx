import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  Cell,
  ColumnDef,
} from '@tanstack/react-table';
import { PiCaretDoubleRightBold, PiCaretDoubleLeftBold } from "react-icons/pi";
import { mkConfig, generateCsv, download } from 'export-to-csv';

import {
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  Icon,
  Input,
  Select,
  Stack,
  Table,
  Tooltip,
} from "@nordhealth/react";
import SortButton from '@/components/SortButton';
import { useEffect } from 'react';
import { getPriceForWeight } from './OfftakeModal';
import { useQuery } from '@tanstack/react-query';
import { fetchDataFromCollection } from './data';
import { useAuth } from './AuthContext';
import { countFarmersByGender } from './routes/_authenticated/app';

// Generic type constrained to object for safe property access
interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onTotalChange?: (total: number | string) => void;
  setExportFn?: ((fn: () => void) => any) | null;
}

interface FilterProps {
  table: any;
  header: any;
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  onTotalChange,
  setExportFn,
}: DataTableProps<TData, TValue>) {
  const { user } = useAuth()

  let filterColumns = user?.role !== "chief-admin" ? columns.filter((column) => column.accessorKey !== "index") : columns

  const table = useReactTable({
    data,
    columns: filterColumns,
    initialState: {
      pagination: { pageSize: 10 },

      sorting: [{ id: 'date', desc: true }, { id: 'Date', desc: true }, { id: 'dateSubmitted', desc: true }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowCount = table.getRowModel().rows.length;
  const pricesQuery = useQuery({
    queryKey: ["pricesQuery"],
    queryFn: () => fetchDataFromCollection("prices"),
    staleTime: Infinity,
  });

  const hasColumn = (key: string) =>
    columns.some((col) => col["accessorKey" as keyof typeof col] === key);

  // When reading values from row.original, cast to any so we can access properties
  const totalGoats = table.getFilteredRowModel().rows.reduce((sum, row) => {
    const original = row.original as any;
    const male =
      hasColumn("maleGoats") ? parseInt(String(original.maleGoats)) || 0 : 0;
    const female =
      hasColumn("femaleGoats") ? parseInt(String(original.femaleGoats)) || 0 : 0;
    return sum + male + female;
  }, 0);


  const sheepGoatPrice = table.getFilteredRowModel().rows.reduce((sum, row) => {
    const original = row.original as any;
    const price =
      hasColumn("sheepGoatPrice") ? parseInt(String(original.sheepGoatPrice)) || 0 : 0;
    return sum + price;
  }, 0);

  const carcassWeight = table.getFilteredRowModel().rows.reduce((sum, row) => {
    const original = row.original as any;
    const price =
      hasColumn("sheepGoatPrice") ? parseInt(String(original.sheepGoatPrice)) || 0 : 0;
    return sum + price;
  }, 0);

  const sheepGoatNo = table.getFilteredRowModel().rows.reduce((sum, row) => {
    const original = row.original as any;
    const price =
      hasColumn("noSheepGoats") ? parseInt(String(original.noSheepGoats)) || 0 : 0;
    return sum + price;
  }, 0);

  const totalLandSize = table.getFilteredRowModel().rows.reduce((sum, row) => {
    const original = row.original as any;
    const price =
      hasColumn("landSize") ? parseInt(String(original.landSize)) || 0 : 0;
    return sum + price;
  }, 0);

  const filename =
    document.title + `- ${new Date().toISOString().replace(/[:.]/g, '-')}`;

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    filename,
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });



  // Store the function in state (DO NOT EXECUTE IT HERE)
  useEffect(() => {
    if (setExportFn && pricesQuery.data) {
      // Export function (does NOT execute on mount)
      const exportData = () => {
        const rowData = table.getPrePaginationRowModel().rows.flatMap((row) => {
          const farmerData = row.original;

          // 🟢 Step 1: Handle multiple farmers
          let farmersArray = [];
          try {
            farmersArray = Array.isArray(farmerData.farmers)
              ? farmerData.farmers
              : JSON.parse(farmerData.farmers || "[]");
          } catch (error) {
            console.error("Error parsing farmers field:", error);
          }

          if (Array.isArray(farmersArray) && farmersArray.length > 0) {
            return farmersArray.map((farmer, index) => ({
              "Farmer Name": farmer.name || "Unknown",
              "Phone Number": farmer.phoneNo || "N/A",
              "ID Number": farmer.idNo || "N/A",
              "Gender": farmer.gender || "N/A",
              "Location": farmerData.location,
              "Region": farmerData.region,
              "Count No": index + 1,
              "Land Size": farmerData.landSize,
              "Yield Per Harvest": farmerData.yieldPerHarvest,
              "Model": farmerData.model,
              "Total Acres Pasture": farmerData.totalAcresPasture,
              "Total Bales": farmerData.totalBales,
            }));
          }

          // 🟢 Step 2: Handle liveWeight & carcassWeight as multiple rows
          if (Array.isArray(farmerData.liveWeight) && Array.isArray(farmerData.carcassWeight)) {
            const entries = farmerData.liveWeight.map((weight, index) => {
              const carcass = farmerData.carcassWeight[index] || "";
              const price = farmerData.pricePerGoatAndSheep[index] || "";

              return {
                "Date": farmerData.date,
                "Farmer Name": farmerData.farmerName,
                "ID Number": farmerData.idNumber || "N/A",
                "Gender": farmerData.gender || "N/A",
                "Phone Number": farmerData.phoneNumber,
                "Location": farmerData.location,
                "Region": farmerData.region,
                "Count No": index + 1, // ➕ Goat counter
                liveWeight: weight,
                carcassWeight: carcass,
                price: price,
                "Total Amount": "", // left blank on each row
              };
            });

            const totalCount = farmerData.liveWeight.length;
            const totalPrice = farmerData.sheepGoatPrice || "0";
            entries.push({})
            // 🔽 Summary row
            entries.push({
              "Count No": `Total: ${totalCount}`,
              "Date": "",
              "Farmer Name": "",
              "Phone Number": "",
              "Location": "",
              "Region": "",
              "Live Weight": "",
              "Carcass Weight": "",
              "Total Amount": `Total: ${totalPrice}`,
            });
            entries.push({})
            entries.push({})

            return entries;
          }


          // 🟢 Step 3: Return the row unchanged if no special conditions apply
          delete farmerData["id"];
          delete farmerData["timestamp"];
          return { ...farmerData };
        });

        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };


      setExportFn(() => exportData); // Store function reference, not execute it
    }
  }, [data, pricesQuery.data, setExportFn]);
  const getAverages = (data) => {
    const totals = data.reduce(
      (acc, item) => {
        acc.totalLiveWeight += Number(item.liveWeight);
        acc.totalCarcassWeight += Number(item.carcassWeight);
        acc.totalPrice += Number(item.pricePerGoatAndSheep);
        acc.count += 1;
        return acc;
      },
      { totalLiveWeight: 0, totalCarcassWeight: 0, totalPrice: 0, count: 0 }
    );

    return {
      avgLiveWeight: totals.totalLiveWeight / totals.count,
      avgCarcassWeight: totals.totalCarcassWeight / totals.count,
      avgPricePerGoatAndSheep: totals.totalPrice / totals.count
    };
  };

  useEffect(() => {
    if (onTotalChange) {

      if (hasColumn("sheepGoatPrice")) {

        const data = table.getPrePaginationRowModel().rows.map((row) => row.original)
        // console.log(data, farmer.farmerName);


        const flatMappedData = data.flatMap(farmer => {
          if (typeof farmer.carcassWeight === "string")
            console.log(`Issue with farmer ${farmer.farmerName}, date : ${farmer.date}`);
          return farmer.carcassWeight.map((_, index) => ({
            ...farmer, // Spread farmer details
            carcassWeight: farmer.carcassWeight[index],
            liveWeight: farmer.liveWeight[index],
            pricePerGoatAndSheep: farmer.pricePerGoatAndSheep[index]
          }))

        }

        );

        const averages = getAverages(flatMappedData);


        onTotalChange(`Total Amount: ${sheepGoatPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | Total Goats No: ${sheepGoatNo} | Average Amount: ${(averages.avgPricePerGoatAndSheep).toFixed(2)} | Average LW: ${(averages.avgLiveWeight).toFixed(2)} | Average CW: ${(averages.avgCarcassWeight).toFixed(2)}`);

      }
      if (hasColumn("maleGoats")) {

        const { rows } = table.getFilteredRowModel()
        const data = rows.map((row) => row.original)

        const { maleLivestockFarmers, femaleLivestockFarmers } = countFarmersByGender(data);


        onTotalChange(`| Total Goats: ${totalGoats} | Total Farmers: ${rows.length.toLocaleString()} | Male Farmers: ${maleLivestockFarmers} | Female Farmers: ${femaleLivestockFarmers} `);

      }
      if (hasColumn("landSize")) {
        const totalFarmers = table.getFilteredRowModel().rows.flatMap((row) => row.original.farmers.map((farmer) => ({ ...farmer })))

        onTotalChange(`| Total Land Size: ${totalLandSize} | Total Farmers: ${totalFarmers.length} `);

      }

    }


  }, [totalGoats, sheepGoatPrice, sheepGoatNo, onTotalChange, table.getPrePaginationRowModel().rows]);

  return (
    <>
      <Card
        padding="none"
        style={{
          position: 'absolute',
          insetBlockStart: 'calc(var(--n-size-top-bar) + var(--n-space-xl))',
          insetBlockEnd: 'calc(var(--n-space-xxl))',
          insetInlineStart: 'var(--n-space-l)',
          insetInlineEnd: 'var(--n-space-l)',
          minBlockSize: '100px',
          inlineSize: 'auto',
          zIndex: 100,
        }}
      >
        <div className="scrollable">
          <Table
            scroll-snap
            style={{
              backgroundColor: 'var(--n-color-surface)',
            }}
          >
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => {
                      if (header.isPlaceholder) {
                        return <th key={header.id}></th>;
                      }

                      return (
                        <th
                          className="font-bold"
                          key={header.id}
                          style={{
                            width: header.getSize(),
                            ...(header.column.columnDef?.meta || {}),
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex flex-col gap-6">
                            <div>
                              {header.column.getCanFilter() ? (
                                <Filter header={header} table={table} />
                              ) : null}
                            </div>
                            <div className="n-typescale-m cursor-pointer">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <SortButton header={header} />
                              )}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rowCount > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(
                        (
                          cell: Cell<TData, unknown>,

                        ) => (
                          <td
                            title={String(cell.getValue())}
                            key={cell.id}
                            className={(cell.column.columnDef.meta?.className)} style={{
                              width: cell.column.getSize(),
                              cursor: 'pointer',
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length}>
                      <EmptyState>No items found</EmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Table>
        </div>
        <Stack
          justifyContent="center"
          alignItems="center"
          style={{
            position: 'absolute',
            bottom: -50,
          }}
          direction="horizontal"
          gap="s"
        >
          <div className="items-center gap-3 hidden lg:flex">
            <div>
              Showing{' '}
              {table.getRowModel().rows.length.toLocaleString()} of{' '}
              {table.getRowCount().toLocaleString()} Rows
            </div>
            <Select
              hideLabel
              className="hidden lg:flex"
              value={table.getState().pagination.pageSize.toString()}
              onChange={(e) => {
                table.setPageSize(Number((e.target as HTMLInputElement).value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <ButtonGroup className="hidden lg:flex">
              <Button
                variant="primary"
                aria-describedby="first"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <PiCaretDoubleLeftBold
                  className={`h-4 w-4 ${table.getCanPreviousPage() ? 'text-white' : ''
                    }`}
                />
              </Button>
              <Tooltip id="first">First page</Tooltip>
              <Button
                variant="primary"
                aria-describedby="previous"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <Icon name="arrow-left" />
              </Button>
              <Tooltip id="previous">Previous</Tooltip>
              <Button
                variant="primary"
                aria-describedby="next"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <Icon name="arrow-right" />
              </Button>
              <Tooltip id="next">Next</Tooltip>
              <Button
                variant="primary"
                aria-describedby="last"
                onClick={() =>
                  table.setPageIndex(table.getPageCount() - 1)
                }
                disabled={!table.getCanNextPage()}
              >
                <PiCaretDoubleRightBold
                  className={`h-4 w-4 ${table.getCanNextPage() ? 'text-white' : ''
                    }`}
                />
              </Button>
              <Tooltip id="last">Last page</Tooltip>
            </ButtonGroup>
            <span>
              | Go to page:
              <input
                placeholder="Go to"
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                max={table.getPageCount()}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <Button
              variant="primary"
              onClick={() => {
                table.resetColumnFilters();
                table.setSorting([{ id: "modified", desc: true }]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Stack>
      </Card>
    </>
  );
}

function Filter({ table, header }: FilterProps) {
  let column = header.column;
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue() || [];

  if (column.id === "index") return null;

  return typeof firstValue === 'number' && column.id !== "status" || column.id.includes("Goat") ? (
    // Number Range Filter
    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
      <Input hideLabel disallowPattern="[^0-9]" type="number" style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px ` } as React.CSSProperties}
        value={columnFilterValue[0] ?? ''}
        onInput={e => {
          let input = e.target as HTMLInputElement;
          column.setFilterValue([input.value, columnFilterValue[1]]);
        }}
        placeholder="Min"
      />
      <Input hideLabel disallowPattern="[^0-9]" type="number" style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px ` } as React.CSSProperties}
        value={columnFilterValue[1] ?? ''}
        onInput={e => {
          let input = e.target as HTMLInputElement;
          column.setFilterValue([columnFilterValue[0], input.value]);
        }}
        placeholder="Max"
      />
    </div>
  ) : typeof firstValue === 'string' && (column.id.toLowerCase().includes("date") || column.id.toLowerCase().includes("schedule")) ? (
    // Date Range Filter
    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
      <Input hideLabel type="date" title={columnFilterValue[0] ?? "Select a date"}  // 👈 Show full date on hover
        style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px ` } as React.CSSProperties}
        value={columnFilterValue[0] ?? ''}
        onInput={e => {
          let input = e.target as HTMLInputElement;
          column.setFilterValue([input.value, columnFilterValue[1]]);
        }}
        placeholder="Start Date"
      />
      <Input hideLabel type="date" title={columnFilterValue[1] ?? "Select a date"}  // 👈 Show full date on hover
        style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px ` } as React.CSSProperties}
        value={columnFilterValue[1] ?? ''}
        onInput={e => {
          let input = e.target as HTMLInputElement;
          column.setFilterValue([columnFilterValue[0], input.value]);
        }}
        placeholder="End Date"
      />
    </div>
  ) : (
    // Default Text Input Filter
    <Input hideLabel style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px ` } as React.CSSProperties}
      onInput={(e) => {
        let input = e.target as HTMLInputElement;
        column.setFilterValue(input.value);
      }}
      onClick={e => e.stopPropagation()}
      placeholder={flexRender(header.column.columnDef.header, header.getContext())?.toString()}
      type="text"
      value={columnFilterValue as string}
    />
  );
}
