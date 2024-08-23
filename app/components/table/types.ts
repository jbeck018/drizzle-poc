import { TableOptions } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { Property, Record } from "#db/schema";

export type TableProps<T> = {
	data: TableOptions<T>["data"];
	columns: TableOptions<T>["columns"];
	style?: CSSProperties;
};

export type BaseTableData = Record & {
	properties: Property[];
};
