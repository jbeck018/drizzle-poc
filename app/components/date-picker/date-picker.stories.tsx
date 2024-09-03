import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './date-picker';
import 'react-datepicker/dist/react-datepicker.css';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    selectedDate: new Date(),
    onChange: (date) => console.log('Selected date:', date),
    isClearable: true,
    showPopperArrow: true,
  },
};

export const WithoutClearButton: Story = {
  args: {
    ...Default.args,
    isClearable: false,
  },
};

export const WithoutPopperArrow: Story = {
  args: {
    ...Default.args,
    showPopperArrow: false,
  },
};
