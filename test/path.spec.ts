import assert from 'assert';
import {AdjacencyList, Tree} from '../src';

describe('Grafting Unit Test', () => {
  it('test getPath', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };
    const tree = Tree.fromAdjencyList(adjList);
    const expectedPath = [0, 1, 1];
    const subtree = tree.getSubTree(expectedPath);
    assert.deepStrictEqual(subtree.node, '8');
    const path = tree.getPath(subtree);
    assert.deepStrictEqual(expectedPath, path);
  });
});
