import assert from 'assert';
import {Tree, TreeObject} from '../src';

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
});
