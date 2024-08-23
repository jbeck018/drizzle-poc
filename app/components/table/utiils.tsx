import { Td } from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { startCase } from "lodash-es";
import { Property, property_type_zod_enum } from "#db/schema";
import { BaseTableData } from "./types";

export const baseTableColumnHelper = createColumnHelper<BaseTableData>();

export const createBaseTableColumns = (data: BaseTableData): ColumnDef<BaseTableData>[] => [
	{
        accessorFn: row => row.id,
        id: 'id',
        cell: info => info.getValue(),
        header: () => <span>ID</span>,
    },
	...data.properties.map(property => ({
        [property_type_zod_enum.enum.text]: {
            id: `${property.id}`,
            cell: () => <Td>{property.text_value}</Td>,
            header: () => <span>{startCase(property?.key || '')}</span>,
        },
        [property_type_zod_enum.enum.boolean]: {
            accessorFn: (row: Property) => row.boolean_value || '',
            id: `${property.id}`,
            cell: () => <Td>{`${property?.boolean_value || ''}`}</Td>,
            header: () => <span>{startCase(property?.key || '')}</span>,
        },
        [property_type_zod_enum.enum.date]: {
            accessorFn: (row: Property) => row.date_value || '',
            id: `${property.id}`,
            cell: () => <Td>{property.date_value ? new Intl.DateTimeFormat().format(property.date_value) : ''}</Td>,
            header: () => <span>{startCase(property?.key || '')}</span>,
        },
        [property_type_zod_enum.enum.number]: {
            accessorFn: (row: Property) => row.number_value || '',
            id: `${property.id}`,
            cell: () => <Td>{String(property.number_value || '0')}</Td>,
            header: () => <span>{startCase(property?.key || '')}</span>,
        },
    }[property.property_type]))
]