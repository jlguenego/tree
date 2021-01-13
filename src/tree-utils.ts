import {BranchNode, LeafNode, Tree} from './interfaces/Tree';

export const isBranchNode = <T>(tree: Tree<T>): tree is BranchNode<T> => {
  return tree.children !== undefined && tree.children.length > 0;
};

export const flattenTree = <T>(tree: Tree<T>): Array<T> => {
  if (!isBranchNode(tree)) {
    return [tree.node];
  }
  return tree.children
    .map(c => flattenTree(c))
    .reduce((acc, n) => acc.concat(n), []);
};

export const getLeaves = <T>(tree: Tree<T>): Array<LeafNode<T>> => {
  if (!isBranchNode(tree)) {
    return [tree];
  }
  return tree.children
    .map(c => getLeaves(c))
    .reduce((acc, n) => acc.concat(n), []);
};

export const getNodeArrayDepthFirst = <T>(tree: Tree<T>): T[] => {
  const result = [tree.node];
  if (!isBranchNode(tree)) {
    return result;
  }
  const childrenNodes = tree.children
    .map(c => getNodeArrayDepthFirst(c))
    .reduce((acc, n) => acc.concat(n), []);
  result.push(...childrenNodes);
  return result;
};
