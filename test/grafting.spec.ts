import assert from 'assert';
import {AdjacencyList, Tree, TreeObject} from '../src';

describe('Grafting Unit Test', () => {
  it('test graft', () => {
    const tree = new Tree<number>(23);
    const scion = new Tree<number>(12);
    tree.graft(tree, scion);
    assert.deepStrictEqual(tree.toObject(), {
      node: 23,
      children: [{node: 12}],
    } as TreeObject<number>);

    tree.graft(scion, new Tree<number>(45));
    assert.deepStrictEqual(tree.toObject(), {
      node: 23,
      children: [{node: 12, children: [{node: 45}]}],
    });
    tree.graft(scion, new Tree<number>(46));
    assert.deepStrictEqual(tree.toObject(), {
      node: 23,
      children: [{node: 12, children: [{node: 45}, {node: 46}]}],
    });
  });

  it('test find', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = Tree.fromAdjencyList(adjList);
    const subtree = tree.find(t => t.node === '8') as Tree<string>;
    assert.deepStrictEqual(subtree.toObject(), {node: '8'});
  });
});
