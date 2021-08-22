import { readlineFile, SearchResult } from './fileHelper';

const searchCallbackFn = (
  keyword: string,
  data: string,
  isCaseSensitive?: boolean
) => {
  if (
    RegExp(isCaseSensitive ? keyword : keyword.toLocaleLowerCase()).test(
      isCaseSensitive ? data : data.toLocaleLowerCase()
    )
  ) {
    return true;
  }
  return false;
};

const searchWord = async (
  word: string,
  files: string[],
  progress: (index: number, filename: string) => void
) => {
  const result: SearchResult[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const [index, file] of files.entries()) {
    const fileResult = await readlineFile(word, file, searchCallbackFn);
    result.push(...fileResult);
    progress(index, file);
  }
  return result;
};

export { searchWord, searchCallbackFn };
