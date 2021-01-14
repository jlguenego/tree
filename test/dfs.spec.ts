import assert from 'assert';
import {DFSTree} from '../src';

interface Node {
  value: number;
  level: number;
}

describe('DFS Unit Test', () => {
  it('test DFS search', () => {
    const test = (n: Node) => n.value === 55;
    const getChildren = (n: Node) => {
      if (n.level > 5) {
        return [];
      }
      const level = n.level + 1;
      const children: Node[] = [];
      const n1 = Math.floor(n.value * 0.5);
      if (n1 !== n.value) {
        children.push({level, value: n1});
      }
      const n2 = Math.floor(n.value * 1.5);
      if (n2 !== n.value && n2 !== n1) {
        children.push({level, value: n2});
      }
      return children;
    };
    const bfsTree = new DFSTree<Node>(
      {level: 0, value: 100},
      test,
      getChildren
    );
    const result = bfsTree.search() as Node;
    assert.deepStrictEqual(result.value, 55);
  });
});
