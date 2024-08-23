import styled from '@emotion/styled';
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { startCase } from "lodash-es";
import { Property, property_type_zod_enum } from "#db/schema";
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
	...data.properties.map(property => ({
        [property_type_zod_enum.enum.text]: {
            id: `${property.id}`,
            cell: () => <Span>{property.text_value}</Span>,
            header: () => <Span>{startCase(property?.key || '')}</Span>,
            size: 250,
        },
        [property_type_zod_enum.enum.boolean]: {
            accessorFn: (row: Property) => row.boolean_value || '',
            id: `${property.id}`,
            cell: () => <Span>{`${property?.boolean_value || ''}`}</Span>,
            header: () => <Span>{startCase(property?.key || '')}</Span>,
            size: 250,
        },
        [property_type_zod_enum.enum.date]: {
            accessorFn: (row: Property) => row.date_value || '',
            id: `${property.id}`,
            cell: () => <Span>{property.date_value ? new Intl.DateTimeFormat().format(property.date_value) : ''}</Span>,
            header: () => <Span>{startCase(property?.key || '')}</Span>,
            size: 250,
        },
        [property_type_zod_enum.enum.number]: {
            accessorFn: (row: Property) => row.number_value || '',
            id: `${property.id}`,
            cell: () => <Span>{String(property.number_value || '0')}</Span>,
            header: () => <Span>{startCase(property?.key || '')}</Span>,
            size: 250,
        },
    }[property.property_type]))
]