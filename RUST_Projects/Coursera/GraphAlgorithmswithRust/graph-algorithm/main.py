# Test Code for Graph Problems:

# Simple and fast implementation of DFS,BFS and Djiska Algorithms

#2 Steps in solving a Graph problem. First recognise its 

from collections import defaultdict


# --- PHASE1 : Graph Representation: 
# Phase 2 Walk the graph


# To Build the graph we build pairwise connections between all the elements represented in the diagram 

def add_undirected_edge(graph,a,b):
    graph[a].append(b)
    graph[b].append(a)
    return graph


# Call the function add_undirected_edge and build the graph step by step


# Phase 2 of the algorithm: 
# Perform the DFS Search algorithm here.

def reverse_list(original:list)-> list:
    reverse = original.copy()

    for i in range(len(original)-1):
        reverse[len(original)-1-i]=original[i]
    return reversed

def reverse_list_pythonic(original:list)->list:
    return original[::-1]



def dfs_path(graph,start,end):
    stack = [start]
    visited = {start} #you could also do it differently define a list of zeros -> and then for each one of them that visited you 
                      # visited = [0 for i in graph]

    came_from = {}
    path = []

    while stack:
        current = stack.pop()

        if current==end:
            path = []
            path.append(end)

            while end in came_from:
                end = came_from[end]
                path.append(end)

            return path[::-1] # which is also good. --> but as you exit the code you dont see the last one right: goal, before goal, .....start -> the real path starts from start to goal right -> so you would get: start----goal

        # The second case when we dont see the current as goal
        # We go in the children
        for neighbour in graph[current]:
            if neighbour not in visited:
                visited.add(neighbour) #set datasturcut
                came_from[neighbour]=current
                stack.append(neighbour)
    return path


def main():
    print("Hello from graph-algorithm!")
    graph = defaultdict(list)
    add_undirected_edge(graph,"Rossio","Baixa-Chiado")
    add_undirected_edge(graph,"Rossio","Castelo")
    add_undirected_edge(graph,"Baixa-Chiado","Cais do Sodre")
    add_undirected_edge(graph,"Castelo","Alfama")
    add_undirected_edge(graph,"Cais do Sodre","Alfama")
    start = "Rossio"
    #end =  "Castelo"
    end = "Cais do"
    return dfs_path(graph,start,end)


if __name__ == "__main__":
    print (main())


# Another assignment could be ok: write some tests for this code: 
# We can add a test if the path to the goal does not exist

# Add the tests here and 
    
