import assert from 'assert';
import {AdjacencyList, Tree} from '../src';

describe('Size Unit Test', () => {
  it('test getSize', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };
    const tree = Tree.fromAdjencyList(adjList);
    const size = tree.getSize();
    assert.deepStrictEqual(size, 8);
  });
});
