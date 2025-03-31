import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    Cell, ColumnDef,
} from '@tanstack/react-table'
import { PiCaretDoubleRightBold, PiCaretDoubleLeftBold } from "react-icons/pi";

import { Badge, Button, ButtonGroup, Card, DatePicker, EmptyState, Icon, Input, Select, Stack, Table, Tooltip } from "@nordhealth/react";
import SortButton from '@/components/SortButton';
import { useEffect } from 'react';
// import { useTableSearchParams } from "tanstack-table-search-params";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onTotalChange: (total: number) => void;
}

interface FilterProps {
    table: any,
    header: any
}
export function FarmersTable<TData, TValue>({
    columns,
    data,
    onTotalChange
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

    })
    const rowCount = table.getRowModel().rows.length;
    const hasColumn = (key: string) => columns.some(col => col.accessorKey === key);

    let maleGoats = 0
    if (hasColumn("maleGoats")) {
        maleGoats = table.getFilteredRowModel().rows.reduce(
            (sum, row) => parseInt(row.original.maleGoats) ? sum + parseInt(row.original.maleGoats) : sum,
            0
        );
    }
    let femaleGoats = 0
    if (hasColumn("femaleGoats")) {
        maleGoats = table.getFilteredRowModel().rows.reduce(
            (sum, row) => row.original.femaleGoats? sum + parseInt(row.original.femaleGoats): sum,
            0
        );
    }







    useEffect(() => {
        onTotalChange(maleGoats + femaleGoats);
    }, [maleGoats, femaleGoats, onTotalChange]);

    return (
        <>

            <Stack className='relative'>

                {/* <div className="scrollable"> */}
                    <Table density='condensed' scroll-snap style={
                        {
                            backgroundColor: 'var(--n-color-surface)',
                        }
                    }
                    >
                        <table>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            if (header.isPlaceholder) {
                                                return <th key={header.id}></th>;
                                            }

                                            return (
                                                <th className='font-bold'
                                                    key={header.id}
                                                    style={{
                                                        width: header.getSize(),
                                                        ...(header.column.columnDef?.meta)
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
                                {
                                    rowCount > 0 ?

                                        table.getRowModel().rows.map((row) => (
                                            <tr key={row.id}>
                                                {row.getVisibleCells().map((cell: Cell<TData, unknown>, index: number, array: Cell<TData, unknown>[]) => (
                                                    <td title={cell.getValue() as string}
                                                        key={cell.id}
                                                        className={
                                                            "n-table-ellipsis"
                                                        }
                                                        style={{
                                                            width: cell.column.getSize(),
                                                            // ...(cell.column.columnDef?.meta)?.style,
                                                            cursor: 'pointer'
                                                        }
                                                        }
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        )) : <tr>
                                            <td colSpan={columns.length} >
                                                <EmptyState>
                                                    No items found
                                                </EmptyState>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </Table>
                {/* </div> */}
                <Stack className='absolute bottom-0' justifyContent="center" alignItems="center" style={
                    {
                        position: 'absolute',
                        bottom: -30
                    }
                } direction="horizontal" gap="s">
                    <div className="items-center gap-3 hidden lg:flex">
                        <div>
                            Showing {table.getRowModel().rows.length?.toLocaleString()} of{' '}
                            {table.getRowCount()?.toLocaleString()} Rows
                        </div>

                        <Select size='s' hideLabel className="hidden lg:flex"
                            value={table.getState().pagination.pageSize.toString()}
                            onChange={e => {
                                table.setPageSize(Number((e.target as HTMLInputElement).value))
                            }}
                        >
                            {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <span className="flex items-center gap-1">
                            <div>Page</div>
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </strong>
                        </span> */}
                        <ButtonGroup className="hidden lg:flex">
                            <Button size="s"variant="primary" aria-describedby="first" onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}>
                                <PiCaretDoubleLeftBold className={`h-4 w-4 ${table.getCanPreviousPage() ? 'text-white' : ''}`} />
                            </Button>
                            <Tooltip id="first">First page</Tooltip>
                            <Button size="s"variant="primary" aria-describedby="previous" onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}>
                                <Icon name="arrow-left" />
                            </Button>
                            <Tooltip id="previous">Previous</Tooltip>
                            <Button size="s"variant="primary" aria-describedby="next" onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}>
                                <Icon name="arrow-right" />
                            </Button>
                            <Tooltip id="next">Next</Tooltip>
                            <Button size="s"variant="primary" aria-describedby="last" onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}>
                                <PiCaretDoubleRightBold className={`h-4 w-4 ${table.getCanNextPage() ? 'text-white' : ''}`} />
                            </Button>
                            <Tooltip id="last">Last page</Tooltip>

                        </ButtonGroup>

                        {/* <span>
                            | Go to page:
                            <input
                                placeholder="Go to"
                                type="number"
                                value={table.getState().pagination.pageIndex + 1}
                                max={table.getPageCount()}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                                className="border p-1 rounded w-16"
                            />
                        </span> */}
                        <Button size="s"variant="primary" onClick={() => {
                            table.resetColumnFilters()
                            table.setSorting([{
                                id: "modified",
                                desc: true
                            }])

                        }

                        }>Reset Filters</Button>
                    </div>
                </Stack>

            </Stack></>

    )
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
            <Input hideLabel disallowPattern="[^0-9]" type="number"  style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px `} as React.CSSProperties}
                value={columnFilterValue[0] ?? ''}
                onInput={e => {
                    let input = e.target as HTMLInputElement;
                    column.setFilterValue([input.value, columnFilterValue[1]]);
                }}
                placeholder="Min"
            />
            <Input hideLabel disallowPattern="[^0-9]" type="number"   style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px `} as React.CSSProperties}
                value={columnFilterValue[1] ?? ''}
                onInput={e => {
                    let input = e.target as HTMLInputElement;
                    column.setFilterValue([columnFilterValue[0], input.value]);
                }}
                placeholder="Max"
            />
        </div>
    ) : typeof firstValue === 'string' && (column.id.toLowerCase().includes("date") ||  column.id.toLowerCase().includes("schedule")) ? (
        // Date Range Filter
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
            <Input hideLabel type="date"   title={columnFilterValue[0] ?? "Select a date"}  // 👈 Show full date on hover
   style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px `} as React.CSSProperties}
                value={columnFilterValue[0] ?? ''}
                onInput={e => {
                    let input = e.target as HTMLInputElement;
                    column.setFilterValue([input.value, columnFilterValue[1]]);
                }}
                placeholder="Start Date"
            />
            <Input hideLabel type="date"   title={columnFilterValue[1] ?? "Select a date"}  // 👈 Show full date on hover
   style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px `} as React.CSSProperties}
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
        <Input hideLabel   style={{ "--n-input-inline-size": `${800 / table.getHeaderGroups().length} px `} as React.CSSProperties}
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
