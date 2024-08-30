import type { Meta, StoryObj } from '@storybook/react';
import { CardSkeletonList } from './skeletons';

const meta: Meta<typeof CardSkeletonList> = {
  title: 'Components/Skeletons',
  component: CardSkeletonList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CardSkeletonList>;

export const Default: Story = {
  args: {
    count: 5,
  },
};

export const ManyCards: Story = {
  args: {
    count: 10,
  },
};

export const SingleCard: Story = {
  args: {
    count: 1,
  },
};
