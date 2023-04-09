class Graph {
    // defining vertex array and
    // adjacent list
    constructor(noOfVertices)
    {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    
    // add vertex to the graph
    addVertex(v)
    {
        // initialize the adjacent list with a
        // null array
        this.AdjList.set(v, []);
    }

    // add edge to the graph
    addEdge(v, w, weight)
    {
        // get the list for vertex v and put the
        // vertex w denoting edge between v and w
        this.AdjList.get(v).push([w, weight]);
    }

    getAdjList() {
        return this.AdjList;
    }

    // Main DFS method
    dfs(source, destination)
    {
        var visited = {};
        var path = [];
        var paths = [];
        var loops = [];
        const gain = 1;
        this.DFSUtil(source, gain, destination, visited, path, paths, loops, gain);
        return [paths, loops];
    }
    
    // Recursive function which process and explore
    // all the adjacent vertex of the vertex with which it is called
    DFSUtil(vert, gain, dest, visited, path, paths, loops, path_gain)
    {
        visited[vert] = true;
        path.push(vert);
        path_gain *= gain; // Multiply gain through the path

        // If we reached the destination node, we found a forward path
        if(vert == dest)
            paths.push([path.map((x) => x), path_gain]);

        var neighbours = this.AdjList.get(vert);
    
        for (var nei of neighbours) {
            var node = nei[0], edge_gain = nei[1];
            if (!visited[node])
                this.DFSUtil(node, edge_gain, dest, visited, path, paths, loops, path_gain);
            else { // If visited before then a cycle is detected
                let index = path.indexOf(node);
                // Add node as last node in the path
                path.push(node);
                var loop = [], loop_gain = 1;
                while(index + 1 < path.length){
                    loop.push(path[index++]);
                    var x = this.AdjList.get(path[index-1])
                            .find((edge) => edge[0] == path[index])
                    loop_gain *= x[1];
                }
                loop.push(path.pop());
                loops.push([loop, loop_gain]);
            }
        }

        visited[vert] = false;
        path_gain /= gain;
        path.pop();
    }

    printGraph()
    {
        // get all the vertices
        var get_keys = this.AdjList.keys();
     
        // iterate over the vertices
        for (var i of get_keys)
    {
            // get the corresponding adjacency list
            // for the vertex
            var get_values = this.AdjList.get(i);
            var conc = "";
     
            // iterate over the adjacency list
            // concatenate the values into a string
            for (var j of get_values)
                conc += "(" + j[0] + ", " + j[1] + ") ";
     
            // print the vertex and its adjacency list
            console.log(i + " -> " + conc);
        }
    }
}

// Using the above implemented graph class
var g = new Graph(6);
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F' ];
 
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('A', 'B', 1);
g.addEdge('A', 'D', 2);
g.addEdge('E', 'A', 3);
g.addEdge('B', 'C', 4);
g.addEdge('D', 'E', 5);
g.addEdge('E', 'F', 6);
g.addEdge('E', 'C', 7);
g.addEdge('C', 'F', 8);
 
// prints all vertex and
// its adjacency list
// A -> B D E
// B -> A C
// C -> B E F
// D -> A E
// E -> A D F C
// F -> E C
g.printGraph();


// prints
// DFS
// A B C E D F
console.log("DFS");
data = g.dfs('A', 'F');
//console.log(data);
for(paths of data)
    console.log(paths);
