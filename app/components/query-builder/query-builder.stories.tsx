import type { Meta, StoryObj } from '@storybook/react';
import QueryBuilder from './query-builder';
import { generateOptimizedSQLQuery } from '#app/routes/api+/generate-filters';
const meta: Meta<typeof QueryBuilder> = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  render: () => <QueryBuilder onSubmit={generateOptimizedSQLQuery}/>,
};

// export const WithInitialCondition: Story = {
//   render: () => {
//     const initialConditions = [
//       {
//         recordType: 'users',
//         property: 'name',
//         operator: 'contains',
//         value: 'John',
//       },
//     ];
//     return <QueryBuilder initialConditions={initialConditions} />;
//   },
// };

// export const MultipleConditions: Story = {
//   render: () => {
//     const initialConditions = [
//       {
//         recordType: 'users',
//         property: 'age',
//         operator: 'greaterThan',
//         value: 25,
//       },
//       {
//         recordType: 'orders',
//         property: 'date',
//         operator: 'after',
//         value: new Date('2023-01-01'),
//       },
//     ];
//     return <QueryBuilder initialConditions={initialConditions} />;
//   },
// };
