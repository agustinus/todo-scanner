import { DataNode } from 'antd/lib/tree';

interface Node extends DataNode {
  parent?: string | null;
}

const transverseBF = (handler: (node: Node) => void, root: Node) => {
  const queue: Node[] = [];
  queue.push(root);
  let current: Node | undefined = queue.pop();
  while (current) {
    if (current?.children) {
      for (let i = 0; current?.children?.length > i; i += 1) {
        queue.push(current.children[i]);
      }
    }
    handler(current);
    current = queue.pop();
  }
};

const addChildren = (data: Node[], target: Node, root: Node) => {
  transverseBF((node) => {
    if (node.key === target.key) {
      Object.assign(node, { children: data });
    }
  }, root);
  return root;
};

export { transverseBF, Node, addChildren };
