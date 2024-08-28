import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './table';
import { createBaseTableColumns } from './utils';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const dummyData = [
  {
    id: 1,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-02'),
    record_type: 'user',
    name: { id: 1, created_at: new Date('2023-01-01'), updated_at: new Date('2023-01-02'), property_type: 'text', text_value: 'John Doe', date_value: null, boolean_value: null, number_value: null, record_id: 1, source: null, key: 'name' },
    email: { id: 2, created_at: new Date('2023-01-01'), updated_at: new Date('2023-01-02'), property_type: 'text', text_value: 'john@example.com', date_value: null, boolean_value: null, number_value: null, record_id: 1, source: null, key: 'email' },
    age: { id: 3, created_at: new Date('2023-01-01'), updated_at: new Date('2023-01-02'), property_type: 'number', text_value: null, date_value: null, boolean_value: null, number_value: '30', record_id: 1, source: null, key: 'age' },
  },
  {
    id: 2,
    created_at: new Date('2023-02-01'),
    updated_at: new Date('2023-02-02'), 
    record_type: 'user',
    name: { id: 4, created_at: new Date('2023-02-01'), updated_at: new Date('2023-02-02'), property_type: 'text', text_value: 'Jane Smith', date_value: null, boolean_value: null, number_value: null, record_id: 2, source: null, key: 'name' },
    email: { id: 5, created_at: new Date('2023-02-01'), updated_at: new Date('2023-02-02'), property_type: 'text', text_value: 'jane@example.com', date_value: null, boolean_value: null, number_value: null, record_id: 2, source: null, key: 'email' },
    age: { id: 6, created_at: new Date('2023-02-01'), updated_at: new Date('2023-02-02'), property_type: 'number', text_value: null, date_value: null, boolean_value: null, number_value: '28', record_id: 2, source: null, key: 'age' },
  },
  {
    id: 3,
    created_at: new Date('2023-03-01'),
    updated_at: new Date('2023-03-02'),
    record_type: 'user',
    name: { id: 7, created_at: new Date('2023-03-01'), updated_at: new Date('2023-03-02'), property_type: 'text', text_value: 'Bob Johnson', date_value: null, boolean_value: null, number_value: null, record_id: 3, source: null, key: 'name' },
    email: { id: 8, created_at: new Date('2023-03-01'), updated_at: new Date('2023-03-02'), property_type: 'text', text_value: 'bob@example.com', date_value: null, boolean_value: null, number_value: null, record_id: 3, source: null, key: 'email' },
    age: { id: 9, created_at: new Date('2023-03-01'), updated_at: new Date('2023-03-02'), property_type: 'number', text_value: null, date_value: null, boolean_value: null, number_value: '35', record_id: 3, source: null, key: 'age' },
  },
];

const columns = createBaseTableColumns(dummyData[0] as any) as any;
console.log(columns);

export const Default: Story = {
  args: {
    data: dummyData,
    columns: columns.filter(Boolean),
    style: { overflow: 'scroll', height: '400px', width: '600px' },
  },
};
