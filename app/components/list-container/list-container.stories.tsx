import type { Meta, StoryObj } from '@storybook/react';

import { ListContainerWithSearch } from './list-container-with-search';

const meta: Meta<typeof ListContainerWithSearch> = {
  title: 'Components/ListContainerWithSearch',
  component: ListContainerWithSearch,
  tags: ['autodocs'],
};
   
  export default meta;
  type Story = StoryObj<typeof ListContainerWithSearch>;
   
  export const ListBasic: Story = {
    args: {
      onChange: console.log,
      searchTerm: '',
      children: Array.from({ length: 10 }, (_, i) => <div key={i}>{i}</div>)
    },
  };