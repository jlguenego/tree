import {getRoot, getSubTreeAdjList} from './adjacency-utils';
import {AdjacencyList} from './interfaces/AdjacencyList';
import {NodeMap} from './interfaces/NodeMap';
import {isBranchNode, TreeObject} from './interfaces/TreeObject';

export class Tree<T> {
  static fromAdjencyList(adjacencyList: AdjacencyList): Tree<string> {
    const root = getRoot(adjacencyList);
    const children = adjacencyList[root].map(c =>
      Tree.fromAdjencyList(getSubTreeAdjList(adjacencyList, c))
    );

    return new Tree(root, children);
  }

  static fromAdjacencyListAndNodeMap = <T>(
    adjacencyList: AdjacencyList,
    nodeMap: NodeMap<T>
  ): Tree<T> => {
    const root = getRoot(adjacencyList);
    const rootNode = nodeMap[root];
    if (!rootNode) {
      throw new Error('Cannot get node for id = ' + root);
    }
    const children = adjacencyList[root].map(c =>
      Tree.fromAdjacencyListAndNodeMap(
        getSubTreeAdjList(adjacencyList, c),
        nodeMap
      )
    );
    return new Tree(rootNode, children);
  };

  static fromObject<T>(to: TreeObject<T>): Tree<T> {
    if (!isBranchNode(to)) {
      return new Tree<T>(to.node);
    }
    return new Tree<T>(
      to.node,
      to.children.map(c => Tree.fromObject(c))
    );
  }

  constructor(public node: T, public children: Tree<T>[] = []) {}

  toObject(): TreeObject<T> {
    if (this.isLeaf()) {
      return {node: this.node};
    }
    return {node: this.node, children: this.children.map(c => c.toObject())};
  }

  isBranch(): boolean {
    return this.children !== undefined && this.children.length > 0;
  }

  isLeaf(): boolean {
    return !this.isBranch();
  }

  flatten(): Array<T> {
    if (this.isLeaf()) {
      return [this.node];
    }
    return this.children
      .map(c => c.flatten())
      .reduce((acc, n) => acc.concat(n), []);
  }

  getLeaves(): Tree<T>[] {
    if (this.isLeaf()) {
      return [this];
    }
    return this.children
      .map(c => c.getLeaves())
      .reduce((acc, n) => acc.concat(n), []);
  }

  enumerateDepthFirst(postOrder = false): T[] {
    const result = [this.node];
    if (this.isLeaf()) {
      return result;
    }
    const childrenNodes = this.children
      .map(c => c.enumerateDepthFirst(postOrder))
      .reduce((acc, n) => acc.concat(n), []);
    if (postOrder) {
      result.unshift(...childrenNodes);
    } else {
      result.push(...childrenNodes);
    }
    return result;
  }

  enumerateBreadthFirst(): T[] {
    const result = [];
    const handles: Tree<T>[] = [this];

    while (true) {
      const t = handles.shift();
      if (t === undefined) {
        break;
      }

      result.push(t.node);
      if (!isBranchNode(t)) {
        continue;
      }
      for (const c of t.children) {
        handles.push(c);
      }
    }

    return result;
  }

  clone(): Tree<T> {
    return new Tree(
      this.node,
      this.children.map(c => c.clone())
    );
  }

  graft(stock: Tree<T>, scion: Tree<T>, index?: number): void {
    if (stock.isLeaf() || index === undefined) {
      stock.children.push(scion);
      return;
    }
    stock.children.splice(index, 0, scion);
  }

  find(testFn: (t: Tree<T>) => boolean): Tree<T> | undefined {
    if (this.isLeaf()) {
      return testFn(this) ? this : undefined;
    }
    for (const c of this.children) {
      const found = c.find(testFn);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  forEach(callback: (t: Tree<T>) => void): void {
    callback(this);
    for (const c of this.children) {
      c.forEach(callback);
    }
    return;
  }

  getPath(subtree: Tree<T>): number[] | undefined {
    if (this === subtree) {
      return [];
    }
    if (this.isLeaf()) {
      return undefined;
    }
    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      const path = c.getPath(subtree);
      if (path !== undefined) {
        path.unshift(i);
        return path;
      }
    }
    return undefined;
  }

  getSubTree(path: number[]): Tree<T> {
    if (path.length === 0) {
      return this;
    }
    const subPath = path.slice(1);
    return this.children[path[0]].getSubTree(subPath);
  }

  getSize(): number {
    return this.children.reduce((acc, c) => acc + c.getSize(), 1);
  }
}
