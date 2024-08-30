import { record_type_zod_enum } from "#db/schema";

export type Operator = {
    key: string;
    label: string;
    input: React.ReactNode;
  };
  
export type FilterCondition = {
    property: string;
    operator: string;
    value: any;
};

export type FilterSubGroup = {
    conditions: FilterCondition[];
};

export type FilterGroup = {
    subGroups: FilterSubGroup[];
};

export type FormData = {
    recordType: keyof typeof record_type_zod_enum.enum | '';
    groups: FilterGroup[];
};

export interface QueryBuilderProps {
    accordionStart?: 'closed' | 'open';
    onSubmit: (data: FormData) => Promise<string>;
}