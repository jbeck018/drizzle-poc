import type { Meta, StoryObj } from '@storybook/react';
import { ErrorComponent } from "./error-components";

const meta: Meta<typeof ErrorComponent> = {
    title: 'Components/ErrorComponent',
    component: ErrorComponent,
    tags: ['autodocs'],
  };
   
  export default meta;
  type Story = StoryObj<typeof ErrorComponent>;
   
  export const Primary: Story = {
    args: {
      header: 'Error!',
      text: 'Ohhhhhhh shit!',
    },
  };