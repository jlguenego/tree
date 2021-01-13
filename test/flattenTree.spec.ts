import assert from 'assert';
import {flattenTree} from '../src';
import {
  getTreeFromAdjacencyList,
  getTreeFromAdjacencyListAndNodeMap,
} from '../src/adjacency-utils';
import {AdjacencyList} from '../src/interfaces/AdjacencyList';
describe('Flatten Unit Test', () => {
  it('test adjacency list', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = getTreeFromAdjacencyList(adjList);
    const flatArray = flattenTree(tree);
    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });
});
