import assert from 'assert';
import {AdjacencyList, Tree} from '../src';

describe('Foreach Unit Test', () => {
  it('test foreach', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };
    const tree = Tree.fromAdjencyList(adjList);
    tree.forEach(t => (t.node = 'a' + t.node));
    const expected = {
      node: 'a1',
      children: [
        {
          node: 'a2',
          children: [
            {node: 'a5'},
            {node: 'a6', children: [{node: 'a7'}, {node: 'a8'}]},
          ],
        },
        {node: 'a3'},
        {node: 'a4'},
      ],
    };
    assert.deepStrictEqual(tree.toObject(), expected);
  });
});
