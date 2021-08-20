import readline from 'readline';
import { readdirSync, Dirent, createReadStream } from 'fs';
import { Node } from './treeData';

interface SearchResult {
  path: string;
  data: string;
  lineNo: number;
}

const readlineFile = async (
  word: string,
  path: string | undefined,
  callbackFn: (
    keyword: string,
    data: string,
    isCaseSensitive?: boolean
  ) => boolean
) => {
  const result: SearchResult[] = [];
  if (path) {
    const readStream = createReadStream(path);
    const rl = readline.createInterface({
      input: readStream,
    });
    let lineNo = 0;
    // eslint-disable-next-line no-restricted-syntax
    for await (const data of rl) {
      lineNo += 1;
      if (callbackFn(word, data)) {
        result.push({
          path,
          data,
          lineNo,
        });
      }
    }
  }
  return result;
};

const getDirectories = (src: string): Dirent[] => {
  const result = readdirSync(src, { withFileTypes: true });
  return result;
};

const retriveDirectories = (path: string): Node[] => {
  const directories = getDirectories(path);
  return directories.map((dir) => {
    return {
      parent: path,
      title: dir.name,
      key: `${path !== '/' ? path : ''}/${dir.name}`,
      isLeaf: !dir.isDirectory(),
    };
  });
};

const scanAllFiles = (path: string, files: string[]) => {
  const dirs = getDirectories(path);

  dirs.forEach((dir) => {
    const fullPath = `${path}/${dir.name}`;
    if (dir.isDirectory()) {
      scanAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });
};

export { retriveDirectories, scanAllFiles, SearchResult, readlineFile };
