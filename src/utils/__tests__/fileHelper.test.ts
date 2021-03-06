import fs from 'fs';
import { retriveDirectories, scanAllFiles } from '../fileHelper';

jest.mock('fs');
const readDirectoryMock = jest.spyOn(fs, 'readdirSync');

describe('fileHelper', () => {
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

  it('should get all directory entries', () => {
    const dirs = retriveDirectories('/');
    expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    expect(dirs.length).toEqual(2);
    expect(dirs[0].isLeaf).toBeFalsy();
    expect(dirs[0].title).toEqual('directory-name');
    expect(dirs[0].key).toEqual('/directory-name');
    expect(dirs[1].isLeaf).toBeTruthy();
    expect(dirs[1].title).toEqual('file-name0');
    expect(dirs[1].key).toEqual('/file-name0');
  });

  it('should get all files', () => {
    const files: string[] = [];
    scanAllFiles('', files);
    expect(fs.readdirSync).toHaveBeenCalledTimes(2);
    expect(files.length).toEqual(3);
    const expectedFiles = [
      '/file-name0',
      '/directory-name/file-name1',
      '/directory-name/file-name2',
    ];
    expectedFiles.forEach((file) => {
      expect(files).toContainEqual(file);
    });
  });
});
