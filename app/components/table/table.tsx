import {
    Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Record } from '#db/schema';
  
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react';
import { TD, TH, TR, Table, TableBody, TableHeader } from './components';
import { TableProps } from './types';

export function DataTable<T extends Omit<Record, 'record_type'>>({ data, columns, style = {} }: TableProps<T>) {
  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: process.env.NODE_ENV !== 'production',
      defaultColumn: {
        size: 'auto' as unknown as number,
        minSize: 100,
      },
  });
    
  const { rows } = table.getRowModel()

  const visibleColumns = table.getVisibleLeafColumns()

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: index => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 10,
  })

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10,
  })

  const virtualColumns = columnVirtualizer.getVirtualItems()
  const virtualRows = rowVirtualizer.getVirtualItems()

  let virtualPaddingLeft: number | undefined
  let virtualPaddingRight: number | undefined

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
  }

  return (
    <Table ref={tableContainerRef as any} style={style}>
        <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
                <TR
                    key={headerGroup.id}
                    style={{ display: 'flex', width: '100%', backgroundColor: '#fff', }}
                >
                    {virtualPaddingLeft ? (
                    //fake empty column to the left for virtualization scroll padding
                        <TH style={{ display: 'flex', width: virtualPaddingLeft, minWidth: 10 }} />
                    ) : null}
                    {virtualColumns.map(vc => {
                        const header = headerGroup.headers[vc.index]
                        return (
                            <TH
                                key={header.id}
                                style={{
                                    display: 'flex',
                                    width: header.getSize(),
                                    backgroundColor: '#fff',
                                }}
                            >
                                <div
                                    {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none'
                                            : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                    style={{ textAlign: 'center' }}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: ' 🔼',
                                        desc: ' 🔽',
                                    }[header.column.getIsSorted() as string] ?? null}
                                </div>
                            </TH>
                        )
                    })}
                    {virtualPaddingRight ? (
                    //fake empty column to the right for virtualization scroll padding
                        <TH style={{ display: 'flex', width: virtualPaddingRight }} />
                    ) : null}
                </TR>
            ))}
        </TableHeader>
        <TableBody>
            {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index] as Row<T>
            const visibleCells = row.getVisibleCells()

            return (
                <TR
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    key={row.id}
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                        width: '100%',
                    }}
                    >
                    {virtualPaddingLeft ? (
                        //fake empty column to the left for virtualization scroll padding
                        <TD style={{ display: 'flex', width: virtualPaddingLeft }} />
                    ) : null}
                    {virtualColumns.map(vc => {
                        const cell = visibleCells[vc.index]
                        return (
                            <TD
                                key={cell.id}
                                style={{
                                    display: 'flex',
                                    width: cell.column.getSize(),
                                }}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TD>
                        )
                    })}
                    {virtualPaddingRight ? (
                        //fake empty column to the right for virtualization scroll padding
                        <TD style={{ display: 'flex', width: virtualPaddingRight }} />
                    ) : null}
                </TR>
            )
            })}
        </TableBody>
    </Table>
    )

  }