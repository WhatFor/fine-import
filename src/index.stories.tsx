import { Meta, StoryObj } from "@storybook/react";
import { FineUpload } from ".";

interface TestUploadFormat {
  name: string;
  age: number;
}

const meta: Meta<typeof FineUpload> = {
  component: () => (
    <FineUpload<TestUploadFormat> className="flex flex-col space-y-3">
      <FineUpload.Uploader className="bg-gray-800 text-white w-1/2 shadow border rounded mx-auto p-5 text-center cursor-pointer">
        <h1>Upload your file</h1>
        <h3>We accept both xlsx and csv</h3>
      </FineUpload.Uploader>

      <FineUpload.Table className="w-full rounded border p-3 bg-gray-50">
        {(data) => <tr>{data}</tr>}
        {/* <FineUpload.Table.Header className="border-b border-black">
          Hello
        </FineUpload.Table.Header> */}
      </FineUpload.Table>
    </FineUpload>
  ),
  title: "Table",
};

export default meta;
type Story = StoryObj<typeof FineUpload>;

export const Default: Story = {
  args: {},
};
