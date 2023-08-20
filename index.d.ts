import { ReactNode } from "react";
interface BaseProps {
    className?: string;
    children?: ReactNode;
}
interface TableRootProps extends Omit<BaseProps, "children"> {
    cool?: boolean;
    children: (row: any) => ReactNode;
}
interface HeaderProps extends BaseProps {
}
interface UploaderProps extends BaseProps {
}
interface FineUploadProps extends BaseProps {
}
export declare let FineUpload: (<TImport>(props: FineUploadProps) => import("react/jsx-runtime").JSX.Element) & {
    Table: ((props: TableRootProps) => import("react/jsx-runtime").JSX.Element) & {
        Header: (props: HeaderProps) => import("react/jsx-runtime").JSX.Element;
    };
    Uploader: (props: UploaderProps) => import("react/jsx-runtime").JSX.Element;
};
export {};
