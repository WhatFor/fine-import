import { Meta, StoryObj } from "@storybook/react";
import SayHello from ".";

const meta: Meta<typeof SayHello> = {
  component: SayHello,
  title: "Components/SayHello",
};

export default meta;
type Story = StoryObj<typeof SayHello>;

export const Default: Story = {};
