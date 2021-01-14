import {AdjacencyList} from './interfaces/AdjacencyList';

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
