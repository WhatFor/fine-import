import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { parse } from "papaparse";

interface BaseProps {
  className?: string;
  children?: ReactNode;
}

enum Stage {
  Initial,
  Uploading,
  Failed,
  Completed,
}

interface FineUploadContextState {
  stage: Stage;
  initialiseFile: (file: File) => void;
  //todo: type
  previewData: any[];
}

let FineUploadContext = createContext<FineUploadContextState>({
  stage: Stage.Initial,
  initialiseFile: (file: File) => {},
  previewData: [],
});

interface TableRootProps extends Omit<BaseProps, "children"> {
  cool?: boolean;
  // todo: type
  children: (row: any) => ReactNode;
}

const TableRoot = (props: TableRootProps) => {
  const { stage, previewData } = useContext(FineUploadContext);
  console.log("data in table:", previewData);

  if (stage === Stage.Initial) {
    return <></>;
  }

  return (
    <table className={props.className}>
      {previewData && previewData.map((row) => <>{props.children(row)}</>)}
    </table>
  );
};

interface HeaderProps extends BaseProps {}

const Header = (props: HeaderProps) => (
  <thead className={props.className}>{props.children}</thead>
);

interface UploaderProps extends BaseProps {}

const Uploader = (props: UploaderProps) => {
  const { stage, initialiseFile } = useContext(FineUploadContext);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) {
      // todo: error
      return;
    }

    initialiseFile(uploadedFile);
  };

  if (stage !== Stage.Initial) {
    // should this turn into a 'redo' button or something?
    return <></>;
  }

  return (
    // todo: bit too much structure here - and don't like flex.
    // do we want to just offload this to user?
    <div className="flex">
      <input
        onChange={onFileUpload}
        className="hidden"
        type="file"
        accept=".csv,.xlsx"
        id="fineup"
      />
      <label htmlFor="fineup" className={props.className}>
        {props.children}
      </label>
    </div>
  );
};

interface FineUploadProps extends BaseProps {}

const FineUploadRoot = <TImport,>(props: FineUploadProps) => {
  const [stage, setStage] = useState(Stage.Initial);
  const [rawFile, setRawFile] = useState<File | null>(null);

  // todo: type
  const [data, setData] = useState<any[]>([]);

  const initialiseFile = (file: File) => {
    // todo: when validate? now?
    setStage(Stage.Uploading);
    setRawFile(file);
  };

  useEffect(() => {
    if (!rawFile) {
      return;
    }

    parse(rawFile, {
      // todo: can we type the results?
      // todo: types
      complete: (results: { data: any[]; errors: any[]; meta: any }) => {
        setData(results.data);
        setStage(Stage.Completed);
      },
      error: (
        errors: { type: string; code: string; message: string; row: number }[]
      ) => {
        console.log(errors);
        setStage(Stage.Failed);
      },
    });
  }, [rawFile]);

  return (
    <FineUploadContext.Provider
      value={{ stage, initialiseFile, previewData: data }}
    >
      <div className={props.className}>{props.children}</div>
    </FineUploadContext.Provider>
  );
};

let Table = Object.assign(TableRoot, {
  Header,
});

export let FineUpload = Object.assign(FineUploadRoot, {
  Table,
  Uploader,
});
