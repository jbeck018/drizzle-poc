import styled from '@emotion/styled';
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { omit, startCase } from "lodash-es";
import { property_type_zod_enum } from "#db/schema";
import { BaseTableData } from "./types";

export const baseTableColumnHelper = createColumnHelper<BaseTableData>();

const Span = styled.span`
    padding: 5px 10px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
`

export const createBaseTableColumns = (data: BaseTableData): ColumnDef<BaseTableData>[] => [
	{
        accessorFn: row => row.id,
        id: 'id',
        cell: info => info.getValue(),
        header: () => <Span>ID</Span>,
        size: 50,
    },
    ...Object.entries(omit(data, ['id', 'created_at', 'updated_at', 'record_type'])).map(([key, property]) => {
        const columnDef = {
            id: key,
            header: () => <Span>{startCase(key || '')}</Span>,
            size: 250,
        };

        switch (property.property_type) {
            case property_type_zod_enum.enum.text:
                return {
                    ...columnDef,
                    accessorFn: (row: BaseTableData) => row[key]?.text_value || '',
                    cell: (info: { getValue: () => any }) => <Span>{info.getValue()}</Span>,
                };
            case property_type_zod_enum.enum.boolean:
                return {
                    ...columnDef,
                    accessorFn: (row: BaseTableData) => row[key]?.boolean_value,
                    cell: (info: { getValue: () => boolean | undefined }) => <Span>{`${info.getValue() ?? ''}`}</Span>,
                };
            case property_type_zod_enum.enum.date:
                return {
                    ...columnDef,
                    accessorFn: (row: BaseTableData) => row[key]?.date_value,
                    cell: (info: { getValue: () => Date | null | undefined }) => {
                        const value = info.getValue();
                        return <Span>{value ? new Intl.DateTimeFormat().format(value) : ''}</Span>;
                    },
                };
            case property_type_zod_enum.enum.number:
                return {
                    ...columnDef,
                    accessorFn: (row: BaseTableData) => row[key]?.number_value,
                    cell: (info: { getValue: () => number | null | undefined }) => <Span>{String(info.getValue() ?? '0')}</Span>,
                };
            default:
                return columnDef;
        }
    })
]