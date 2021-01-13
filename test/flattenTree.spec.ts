import assert from 'assert';
import {flattenTree, getLeaves, getNodeArrayDepthFirst} from '../src';
import {getTreeFromAdjacencyList} from '../src/adjacency-utils';
import {AdjacencyList} from '../src/interfaces/AdjacencyList';

const adjList: AdjacencyList = {
  1: ['2', '3', '4'],
  2: ['5', '6'],
  6: ['7', '8'],
};

const tree = getTreeFromAdjacencyList(adjList);

describe('Flatten Unit Test', () => {
  it('tests flattenTree', () => {
    const flatArray = flattenTree(tree);
    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });

  it('tests getLeaves', () => {
    const flatArray = getLeaves(tree).map(leaf => leaf.node);

    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });

  it('tests getNodeArrayDepthFirst', () => {
    const nodes = getNodeArrayDepthFirst(tree);

    assert.deepStrictEqual(nodes, ['1', '2', '5', '6', '7', '8', '3', '4']);
  });
});
