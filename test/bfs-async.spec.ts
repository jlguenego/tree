import assert from 'assert';
import {BFSTreeAsync} from '../src';
import {sleep} from '../src/sleep';

describe('BFSAsync Unit Test', () => {
  it('BFSAsync', async function () {
    this.timeout(20000);
    const test = async (n: number) => n > 30;
    const getChildren = async (n: number) => {
      await sleep(10);
      return [n + 1, 2 * n + 1];
    };
    const bfsTree = new BFSTreeAsync<number>(1, test, getChildren);
    // bfsTree.subject.subscribe(info => {
    //   console.log('info: ', inspect(info, false, null));
    // });
    const result = await bfsTree.search();
    assert.deepStrictEqual(result, 31);
  });
});
