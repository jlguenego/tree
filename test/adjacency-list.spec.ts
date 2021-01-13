import assert from 'assert';
import {getTreeFromAdjacencyList} from '../src/adjacency-utils';
import {AdjacencyList} from '../src/interfaces/AdjacencyList';

describe('Adjacency Unit Test', () => {
  it('test adjacency list', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = getTreeFromAdjacencyList(adjList);
    const expectedTree = {
      v: '1',
      c: [
        {
          v: '2',
          c: [{v: '5'}, {v: '6', c: [{v: '7'}, {v: '8'}]}],
        },
        {v: '3'},
        {v: '4'},
      ],
    };
    assert.deepStrictEqual(tree, expectedTree);
  });
});
