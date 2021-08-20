import { addChildren, Node, transverseBF } from '../treeData';

describe('treeData', () => {
  let data: Node;

  const generateChildrenData = (number: number, parentKey: number) => {
    const children: Node[] = [];
    for (let i = 0; i < number; i += 1) {
      children.push({
        title: `${parentKey}-${i}`,
        key: `${parentKey}-${i}`,
        isLeaf: !(i % 2),
      });
    }
    return children;
  };

  beforeEach(() => {
    data = {
      title: 'root',
      key: '0',
      isLeaf: false,
    };

    data.children = generateChildrenData(10, 0);
  });

  it('should transverse correctly', () => {
    const result: Node[] = [];
    transverseBF((node) => {
      result.push(node);
    }, data);
    expect(result[0].title).toEqual(`root`);
    for (let i = 1; i < result.length; i += 1) {
      expect(result[i].title).toEqual(`0-${result.length - i - 1}`);
      expect(result[i].key).toEqual(`0-${result.length - i - 1}`);
      expect(result[i].isLeaf).toEqual(!((result.length - i - 1) % 2));
    }
  });

  it('should be able to add children', () => {
    const children = generateChildrenData(5, 1);
    const targetNode = { key: '0-5' };
    const treeData = addChildren(children, targetNode, data);
    let result: Node | undefined;
    transverseBF((node) => {
      if (node.key === targetNode.key) {
        result = node;
      }
    }, treeData);
    expect(result?.key).toEqual('0-5');
    expect(result?.title).toEqual('0-5');
    expect(result?.children?.length).toEqual(5);
    result?.children?.forEach((child, idx) => {
      expect(child.key).toEqual(children[idx].key);
      expect(child.title).toEqual(children[idx].title);
      expect(child.isLeaf).toEqual(children[idx].isLeaf);
    });
  });
});
