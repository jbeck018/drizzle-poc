import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
    ColumnDef,
    Row,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Record } from '#db/schema';
  
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react';
import { TableProps } from './types';

export function DataTable<T extends Omit<Record, 'record_type'>>({ data, columns, style = {} }: TableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: process.env.NODE_ENV !== 'production',
    });
    
    const { rows } = table.getRowModel()

    const visibleColumns = table.getVisibleLeafColumns()

  //The virtualizers need to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null)

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: index => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: visibleColumns.length, //how many columns to render on each side off screen each way (adjust this for performance)
  })

  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: rows.length,
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
    <Table 
        ref={tableContainerRef as any} 
        variant={'simple'} 
        style={{ 
            display: 'grid',
            overflow: 'auto', //our scrollable table container
            position: 'relative', //needed for sticky header
            height: '100%', //should be a fixed height
            width: '100%',
            ...style,
        }}
    >
        <Thead
            style={{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            }}
        >
            {table.getHeaderGroups().map(headerGroup => (
            <Tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
            >
                {virtualPaddingLeft ? (
                //fake empty column to the left for virtualization scroll padding
                <Th style={{ display: 'flex', width: virtualPaddingLeft }} />
                ) : null}
                {virtualColumns.map(vc => {
                const header = headerGroup.headers[vc.index]
                return (
                    <Th
                    key={header.id}
                    style={{
                        display: 'flex',
                        width: header.getSize(),
                    }}
                    >
                    <div
                        {...{
                        className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                        onClick: header.column.getToggleSortingHandler(),
                        }}
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
                    </Th>
                )
                })}
                {virtualPaddingRight ? (
                //fake empty column to the right for virtualization scroll padding
                <th style={{ display: 'flex', width: virtualPaddingRight }} />
                ) : null}
            </Tr>
            ))}
        </Thead>
        <Tbody
            style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
            }}
        >
            {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index] as Row<T>
            const visibleCells = row.getVisibleCells()

            return (
                <Tr
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
                    <Td
                    style={{ display: 'flex', width: virtualPaddingLeft }}
                    />
                ) : null}
                {virtualColumns.map(vc => {
                    const cell = visibleCells[vc.index]
                    return (
                    <Td
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
                    </Td>
                    )
                })}
                {virtualPaddingRight ? (
                    //fake empty column to the right for virtualization scroll padding
                    <Td style={{ display: 'flex', width: virtualPaddingRight }} />
                ) : null}
                </Tr>
            )
            })}
        </Tbody>
    </Table>
    )

  }