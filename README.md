# Tree

## Install

```
npm i @jlguenego/tree
```

## Usage

### Instantiation

#### From an adjacency list

Sometimes, the simplest way to represent a tree is to give an object where each property key represents each node, and the corresponding value is its children.

```ts
const adjList: AdjacencyList = {
  1: ['2', '3', '4'],
  2: ['5', '6'],
  6: ['7', '8'],
};

const tree = Tree.fromAdjencyList(adjList);
console.log('tree: ', tree);
```

If the node are not string, but more complex object, we can do like this:

```ts
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

const tree = Tree.fromAdjacencyListAndNodeMap(adjList, nodeMap);
console.log('tree: ', tree);
```

#### From an object

```ts
const expectedTree = Tree.fromObject({
  node: '1',
  children: [
    {
      node: '2',
      children: [
        {node: '5'},
        {node: '6', children: [{node: '7'}, {node: '8'}]},
      ],
    },
    {node: '3'},
    {node: '4'},
  ],
});
```

#### From the constructor

To build a tree with no child:

```ts
const tree = new Tree<number>(23);
```

To build a tree with some children :

```ts
const tree = new Tree<number>(23, [
  new Tree<number>(12),
  new Tree<number>(13),
  new Tree<number>(7),
]);
```

This above example creates a tree with a root node (23) and 3 children leaf with 12, 13 and 7.

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
