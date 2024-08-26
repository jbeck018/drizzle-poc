import type { Meta, StoryObj } from '@storybook/react';
import { ErrorComponent } from "./error-components";

const meta: Meta<typeof ErrorComponent> = {
    component: ErrorComponent,
  };
   
  export default meta;
  type Story = StoryObj<typeof ErrorComponent>;
   
  export const Primary: Story = {
    args: {
      header: 'Error!',
      text: 'Ohhhhhhh shit!',
    },
  };