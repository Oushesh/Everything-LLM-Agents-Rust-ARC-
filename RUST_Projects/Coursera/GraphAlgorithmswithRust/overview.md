## Overview Graph Algorithms with Rust: 
   
## 

## Rust Graph Algorithms:
   https://github.com/paiml/rust-graph-algorithms

   
## Algortihm Crates: 
   Graph Core, DFS, BFS, Graph Traversal, Graph Centrality, Graph Community, Graph Viz

## Python and Rust

## Rust Graph Exploration and how to Implement it into Code: 
   DFS: Depth First Search,
   BFS: Breadth First Search,
   Dijska Algorithm

## Depth First Search 
   Whats the difference betwen defaultdict and dict.
   Example Problem: 

   [Rossio] ----------------- [Baixa-Chiado]
         |                             |
  [Castelo de S. Jorge]         [Cais do Sodré]
         |                             |
      [Alfama] ------------------------+



   ```
   Python 
   This is what we want to achieve from the graph:
   {
    'Rossio':        ['Baixa-Chiado', 'Castelo'],
    'Baixa-Chiado':  ['Rossio', 'Cais do Sodré'],
    'Castelo':       ['Rossio', 'Alfama'],
    'Cais do Sodré': ['Baixa-Chiado', 'Alfama'],
    'Alfama':        ['Castelo', 'Cais do Sodré']
}
   ```
      Example Problem above we are in lisbon and we have: 
      Rossio as node, Baixa-Chiado as second node Alfama as third node.
   
   ```
   Python

   from collections import defaultdict

   # in python the DFS is usually implemented recursively or recursive call

   # --- PHASE 1: Graph Representation ---
   graph = defaultdict(list) --> it looks like this here. {a:[],b:[]}


   ## Build the graph as seen above. Step1:

   ## funcion add undirected_graph_edge(a,b)

   def add_undirected_edge(a,b):
      graph[a].append(b)
      grpah[b].append(a)

      return graph

   #Call the function for every element you have there

   ## Phase 2: DFS Algorithm and Traverse 

   def dfs_path(graph, start,goal):
      stack = [start]
      visited = {start}
      came_from = {}

      while stack:
         current = stack.pop() #at this point the stack is empty

         if current == goal: 
            path = [goal] #path is a just a list of all the elements that was # traversed upon and before reaching the goal

            while goal in came_from:
                goal = came_from[goal]
                path.append(goal)

         # if current not goal then we continue in the neighbours
         for neighbour in graph[current]:
             if neighbour not in visted:
                visited.add(neighbour)
                came_from[neighbour] = current
                stack.append(neighbour)

      return None

   ```
   Use AI to generate the cases where this code might fail and stuffs and check robustness of this code.
   ```
   rust

   ```

## Breadth First Search
   

# Dijska Algorithm

## Complexity of DFS: 
   Space Complexity  - O(1)
   Computationl Complexity - N(2) 

   Complexity of BFS: 
   Breadth First Search: 

   Complexity of Dijska Algorithm: 


## <implement both algorithms both in Rust and Python>
