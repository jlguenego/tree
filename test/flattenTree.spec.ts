import assert from 'assert';
import {flattenTree, getLeaves} from '../src';
import {getTreeFromAdjacencyList} from '../src/adjacency-utils';
import {AdjacencyList} from '../src/interfaces/AdjacencyList';
describe('Flatten Unit Test', () => {
  it('tests flattenTree', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = getTreeFromAdjacencyList(adjList);
    const flatArray = flattenTree(tree);
    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });

  it('tests getLeaves', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = getTreeFromAdjacencyList(adjList);
    const flatArray = getLeaves(tree).map(leaf => leaf.node);

    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });
});
