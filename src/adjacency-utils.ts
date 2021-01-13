import {AdjacencyList} from './interfaces/AdjacencyList';
import {NodeMap} from './interfaces/NodeMap';
import {Tree} from './interfaces/Tree';

export function getRoot(t: AdjacencyList): string {
  const children: string[] = Object.values(t).reduce(
    (acc, n) => acc.concat(n),
    []
  );
  for (const p of Object.keys(t)) {
    if (!children.includes(p)) {
      return p;
    }
  }
  throw new Error('Cannot find a root for this tree: ' + JSON.stringify(t));
}

export function getSubTreeAdjList(t: AdjacencyList, n: string): AdjacencyList {
  if (t[n] === undefined) {
    return {
      [n]: [],
    };
  }
  return t[n].reduce((acc, c) => ({...acc, ...getSubTreeAdjList(t, c)}), {
    [n]: t[n],
  });
}

export const getTreeFromAdjacencyList = (
  adjacencyList: AdjacencyList
): Tree<string> => {
  const root = getRoot(adjacencyList);
  const children = adjacencyList[root].map(c =>
    getTreeFromAdjacencyList(getSubTreeAdjList(adjacencyList, c))
  );
  const result = {
    node: root,
  } as Tree<string>;
  if (children.length > 0) {
    result.children = children;
  }
  return result;
};

export const getTreeFromAdjacencyListAndNodeMap = <T>(
  adjacencyList: AdjacencyList,
  nodeMap: NodeMap<T>
): Tree<T> => {
  const root = getRoot(adjacencyList);
  const rootNode = nodeMap[root];
  if (!rootNode) {
    throw new Error('Cannot get node for id = ' + root);
  }
  const children = adjacencyList[root].map(c =>
    getTreeFromAdjacencyListAndNodeMap(
      getSubTreeAdjList(adjacencyList, c),
      nodeMap
    )
  );
  const result = {
    node: rootNode,
  } as Tree<T>;
  if (children.length > 0) {
    result.children = children;
  }
  return result;
};
