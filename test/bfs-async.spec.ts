import assert from 'assert';
import {BFSTreeAsync} from '../src';
import {sleep} from '../src/sleep';

describe('BFSAsync Unit Test', () => {
  it('BFSAsync', async function () {
    this.timeout(20000);
    const test = async (n: number) => {
      await sleep(5);
      return n > 30;
    };
    const getChildren = async (n: number) => {
      await sleep(5);
      return [n + 1, 2 * n + 1];
    };
    const bfsTree = new BFSTreeAsync<number>(1, test, getChildren);
    const result = await bfsTree.search();
    assert.deepStrictEqual(result, 31);
  });

  it('BFSAsync_interrupt', async function () {
    this.timeout(20000);
    const test = async (n: number) => {
      await sleep(1);
      return n > 30;
    };
    const getChildren = async (n: number) => {
      await sleep(1);
      return [n + 1, 2 * n + 1];
    };
    const bfsTree = new BFSTreeAsync<number>(1, test, getChildren);

    bfsTree.search();
    await sleep(20);
    bfsTree.interrupt();
    await sleep(20);
    await bfsTree.search();
    const result = await bfsTree.search();
    assert.deepStrictEqual(result, 31);
  });

  it('BFSAsync_reset', async function () {
    this.timeout(20000);
    const test = async (n: number) => {
      return n > 30;
    };
    const getChildren = async (n: number) => {
      return [n + 1, 2 * n + 1];
    };
    const bfsTree = new BFSTreeAsync<number>(1, test, getChildren);

    const result = await bfsTree.search();
    const size = bfsTree.currentTree.getSize();
    bfsTree.reset();
    const result2 = await bfsTree.search();
    const size2 = bfsTree.currentTree.getSize();
    assert.deepStrictEqual(result, 31);
    assert.deepStrictEqual(result2, 31);
    assert.deepStrictEqual(size, size2);
  });
});
