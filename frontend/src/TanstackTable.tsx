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
  
  // Generic type constrained to object for safe property access
  interface DataTableProps<TData extends object, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onTotalChange?: (total: number) => void;
    setExportFn?:( (fn:()=>void) => any) | null;
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
    const table = useReactTable({
      data,
      columns,
      initialState: {
        pagination: { pageSize: 10 },
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });
  
    const rowCount = table.getRowModel().rows.length;
  
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
  
    const filename =
      document.title + `- ${new Date().toISOString().replace(/[:.]/g, '-')}`;
  
    const csvConfig = mkConfig({
      fieldSeparator: ',',
      filename,
      decimalSeparator: '.',
      useKeysAsHeaders: true,
    });
  
    // Export function (does NOT execute on mount)
    const exportData = () => {
      const rowData = table.getRowModel().rows.map((row) =>
        Object.fromEntries(
          Object.entries(row.original).map(([key, value]) => [
            key,
            typeof value === 'object' ? JSON.stringify(value) : value,
          ])
        )
      );
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    };
  
    // Store the function in state (DO NOT EXECUTE IT HERE)
    useEffect(() => {
      if (setExportFn) {
        setExportFn(() => exportData); // Store function reference, not execute it
      }
    }, [data, setExportFn]);
  
    useEffect(() => {
      if(onTotalChange)
      onTotalChange(totalGoats);
    }, [totalGoats, onTotalChange]);
  
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
                              className="n-table-ellipsis"
                              style={{
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
                    className={`h-4 w-4 ${
                      table.getCanPreviousPage() ? 'text-white' : ''
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
                    className={`h-4 w-4 ${
                      table.getCanNextPage() ? 'text-white' : ''
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
