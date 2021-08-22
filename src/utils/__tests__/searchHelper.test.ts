import fs from 'fs';
import { scanAllFiles, SearchResult } from '../fileHelper';
import { searchCallbackFn, searchWord } from '../searchHelper';
import * as fileHelper from '../fileHelper';

jest.mock('fs');
const readDirectoryMock = jest.spyOn(fs, 'readdirSync');

describe('searchHelper', () => {
  beforeEach(() => {
    readDirectoryMock.mockReset();
    readDirectoryMock
      .mockReturnValueOnce([
        {
          name: 'directory-name',
          isFile: () => false,
          isDirectory: () => true,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        },
        {
          name: 'file-name0',
          isFile: () => false,
          isDirectory: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        },
      ])
      .mockReturnValueOnce([
        {
          name: 'file-name1',
          isFile: () => false,
          isDirectory: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        },
        {
          name: 'file-name2',
          isFile: () => false,
          isDirectory: () => false,
          isBlockDevice: () => false,
          isCharacterDevice: () => false,
          isSymbolicLink: () => false,
          isFIFO: () => false,
          isSocket: () => false,
        },
      ]);
  });
  it('should iterate files to find keyword', async () => {
    const files: string[] = [];
    scanAllFiles('', files);
    const readlineFileMock = jest
      .spyOn(fileHelper, 'readlineFile')
      .mockImplementation(() =>
        Promise.resolve([
          {
            path: 'filename',
            data: 'data',
            lineNo: 1,
          },
        ])
      );
    const result = await searchWord('test', [files[0]], () => {});
    expect(readlineFileMock).toBeCalledTimes(1);
    expect(result).toContainEqual<SearchResult>({
      path: 'filename',
      data: 'data',
      lineNo: 1,
    });
  });
  it('should return the correct result if isCaseSensitive is false', () => {
    const result = searchCallbackFn(
      'keyword',
      'Find this Keyword in this sentence'
    );
    expect(result).toBeTruthy();
  });
  it('should return the correct result if isCaseSensitive is true', () => {
    const data = 'Find this Keyword in this sentence';
    expect(searchCallbackFn('keyword', data, true)).toBeFalsy();
    expect(searchCallbackFn('Keyword', data, true)).toBeTruthy();
  });
});
