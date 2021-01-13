import assert from 'assert';
import {
  getTreeFromAdjacencyList,
  getTreeFromAdjacencyListAndNodeMap,
} from '../src/adjacency-utils';
import {AdjacencyList} from '../src/interfaces/AdjacencyList';
import {NodeMap} from '../src/interfaces/NodeMap';

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

  it('test adjacency list with map', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };
    const nodeMap = ([
      '',
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
    ] as unknown) as NodeMap<string>;

    const tree = getTreeFromAdjacencyListAndNodeMap(adjList, nodeMap);
    const expectedTree = {
      v: 'lorem',
      c: [
        {
          v: 'ipsum',
          c: [
            {v: 'amet'},
            {v: 'consectetur', c: [{v: 'adipiscing'}, {v: 'elit'}]},
          ],
        },
        {v: 'dolor'},
        {v: 'sit'},
      ],
    };
    assert.deepStrictEqual(tree, expectedTree);
  });
});
