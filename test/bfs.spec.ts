import assert from 'assert';
import {BFSTree} from '../src';

describe('BFS Unit Test', () => {
  it('test BFS search', () => {
    const test = (n: number) => n > 10;
    const getChildren = (n: number) => [n + 1, n + 2, n + 3];
    const bfsTree = new BFSTree<number>(3, test, getChildren);
    const result = bfsTree.search();
    assert.deepStrictEqual(result, 11);
  });
});
