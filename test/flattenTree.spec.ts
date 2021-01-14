import assert from 'assert';
import {AdjacencyList, Tree} from '../src';

const adjList: AdjacencyList = {
  1: ['2', '3', '4'],
  2: ['5', '6'],
  6: ['7', '8'],
};

const tree = Tree.fromAdjencyList(adjList);

describe('Flatten Unit Test', () => {
  it('tests flattenTree', () => {
    const flatArray = tree.flatten();
    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });

  it('tests getLeaves', () => {
    const flatArray = tree.getLeaves().map(leaf => leaf.node);

    assert.deepStrictEqual(flatArray, ['5', '7', '8', '3', '4']);
  });

  it('tests getNodeArrayDepthFirst', () => {
    const nodes = tree.enumerateDepthFirst();

    assert.deepStrictEqual(nodes, ['1', '2', '5', '6', '7', '8', '3', '4']);
  });

  it('tests getNodeArrayBreadthFirst', () => {
    const nodes = tree.enumerateBreathFirst();
    assert.deepStrictEqual(nodes, ['1', '2', '3', '4', '5', '6', '7', '8']);
  });
});
