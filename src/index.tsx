import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { parse } from "papaparse";
import { read, utils } from "xlsx";
import { getFileType } from "./utils/file";

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

// todo: this type sucks - can we get rid of it?
interface TableRootProps extends Omit<BaseProps, "children"> {
  cool?: boolean;
  // todo: type?
  children: (row: any) => ReactNode;
}

const TableRoot = (props: TableRootProps) => {
  const { stage, previewData } = useContext(FineUploadContext);

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

interface Config {
  [key: string]: {
    required: boolean;
  };
}

interface FineUploadProps extends BaseProps {
  config: Config;
}

const FineUploadRoot = (props: FineUploadProps) => {
  const [stage, setStage] = useState(Stage.Initial);
  const [rawFile, setRawFile] = useState<File | null>(null);

  const desiredHeaders = Object.keys(props.config);

  // todo: type?
  const [data, setData] = useState<any[]>([]);

  const initialiseFile = (file: File) => {
    // todo: when validate? now?
    setStage(Stage.Uploading);
    setRawFile(file);
  };

  // todo: notes from past me.
  // Ideally we want to guide the user through the process of uploading a file.
  // This includes sorting out their terrible headers.
  // What this really means for us is,
  //  - the dev specifies the type they want the file in - this is keys on config.
  //  - we parse the file and find the headers they've given us.
  //  - at this point, we need to check they match.
  //     - if they do exactly, we can all go on with our lives and be happy.
  //     - if they don't match, there's a few scenarios we could handle:
  //      - case is wrong. this is easy to fix and we can do that.
  //      - spacing is bad. again, we can fix.
  //            - maybe we just trim all kinds of whitespace, understores, etc.
  //      - the headers are out of order. should not break anything.
  //      - we expect something, but it's not found. We tell the user this.
  //         - they either realise they've made a mistkae, fix their file, retry.
  //         - or we can go through each failed heading and ask them to map.
  //            - e.g. "Hey we expected a 'Name' column but couldn't find it."
  //                   "Can you select which colum is 'Name' in your file?"
  //     - ultimately what we're doing is finding a direct 1:1 map
  //       of all cols in their file to the type specified.
  //       once that's done, we can transform their file into the specified format
  //       with the corect headers and pump it out as json.

  // more thoughts:
  //  - We probably don't want to actually parse the imported file and 'apply'
  //    the fixes where possible. Instead, we just post the blob file
  //    as is, and post the mapping object to the server.
  //    This keeps processing slim on the client, and can write some cute
  //    client libs for the server in various languages to 'apply' the mapping.

  const autoResolveMatchingHeader = (
    importedHeader: string,
    desiredHeaders: string[]
  ) => {
    // todo: refactor

    // simple direct comparison:
    if (desiredHeaders.includes(importedHeader)) {
      return importedHeader;
    }

    // differing case:
    const lowerCaseHeaders = desiredHeaders.map((header) =>
      header.toLocaleLowerCase()
    );
    const lowerCaseImportedHeader = importedHeader.toLocaleLowerCase();
    if (lowerCaseHeaders.includes(lowerCaseImportedHeader)) {
      return desiredHeaders[lowerCaseHeaders.indexOf(lowerCaseImportedHeader)];
    }
  };

  const parseCsv = () => {
    parse(rawFile, {
      // todo: can we type the results?
      // todo: types
      complete: (results: { data: string[][]; errors: any[]; meta: any }) => {
        const importedHeaders = results.data[0];
        results.data.shift();

        // todo: this is probably wrong.
        // we're modifying the imported data, which idk if we want to do.
        // we probs just want to keep it as is, and figure out a mapping
        // to the desired headers.
        const objData = results.data.map((row) => {
          const obj: { [key: string]: string } = {};

          row.forEach((cell, index) => {
            const header = importedHeaders[index];
            const desiredHeader = autoResolveMatchingHeader(
              header,
              desiredHeaders
            );

            // todo: desiredHeader should probably handle missing headers?
            // this kinda blows up if we don't find a match.

            if (desiredHeader) {
              obj[desiredHeader] = cell;
            }
          });

          return obj;
        });

        setData(objData);
        setStage(Stage.Completed);
      },
      error: (
        errors: { type: string; code: string; message: string; row: number }[]
      ) => {
        console.log(errors);
        setStage(Stage.Failed);
      },
    });
  };

  const parseXlsx = async () => {
    const buffer = await rawFile.arrayBuffer();
    const wb = read(buffer);
    const firstSheet = wb.Sheets[wb.SheetNames[0]];

    const data = utils.sheet_to_json(firstSheet, {
      skipHidden: true,
      blankrows: false,
    });

    // convert all keys to lowercase - this is temporary for now
    // until we can handle case sensitivity automatically.
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const lowerCaseKey = key.toLocaleLowerCase();
        if (lowerCaseKey !== key) {
          row[lowerCaseKey] = row[key];
          delete row[key];
        }
      });
    });

    setData(data);
    setStage(Stage.Completed);
  };

  useEffect(() => {
    if (!rawFile) {
      return;
    }

    const fileType = getFileType(rawFile);

    switch (fileType) {
      case "csv":
        parseCsv();
        break;
      case "xlsx":
        parseXlsx();
        break;
      default:
        // todo: error
        setStage(Stage.Failed);
    }
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
