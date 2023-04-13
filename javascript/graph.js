class SignalFLowGraph {
    // defining vertex array and
    // adjacent list
    constructor(noOfVertices)
    {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
        this.forwardPaths = [];
        this.loops = [];
        this.delta = new Map();

    }

    
    // add vertex to the graph
    addVertex(v)
    {
        // initialize the adjacent list with a
        // null array
        this.AdjList.set(v, []);
        for(var i = 0; i < 100; i++)
            this.delta.set(i, []);
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

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Main DFS method
    analyze(source, destination)
    {
        var visited = {};
        var path = [];
        const gain = 1;
        this.DFSPaths(source, gain, destination, visited, path, gain);
        for (var i of this.AdjList.keys()) {
            this.DFSLoops(i, i, gain, visited, path, gain);
            visited[i] = true;
        }        
    }
    
    // Recursive function which process and explore
    // all the paths from given vertex to destination
    DFSPaths(vert, gain, dest, visited, path, path_gain)
    {
        visited[vert] = true;
        path.push([vert, gain]);
        path_gain *= gain; // Multiply gain through the path

        // If we reached the destination node, we found a forward path
        if(vert == dest)
            this.forwardPaths.push({"nodes": path.map((x) => x[0]), "gain" : path_gain});

        var neighbours = this.AdjList.get(vert);
        for (var nei of neighbours) {
            var node = nei[0], edge_gain = nei[1];
            if (!visited[node])
                this.DFSPaths(node, edge_gain, dest, visited, path, path_gain);
        }
            
        visited[vert] = false;
        path_gain /= gain;
        path.pop();
    }

    // Find all loops of the graph
    DFSLoops(vert, start, gain, visited, path, path_gain){
        if(visited[vert]){
            if(vert == start){
                /// save loop
                var loop = [];
                loop.push(vert);
                var idx = path.length - 1;
                var loop_gain = gain;

                while(path[idx][0] != vert){
                    loop.push(path[idx][0]);
                    loop_gain *= path[idx--][1];
                }

                loop.push(vert)
                loop.reverse();
                this.loops.push([loop, loop_gain])
            }
            return;
        }
        path.push([vert, gain]);
        path_gain *= gain; // Multiply gain through the path

        visited[vert] = true;
        var neighbours = this.AdjList.get(vert);
        for (var nei of neighbours) {
            var node = nei[0], edge_gain = nei[1];   
            this.DFSLoops(node, start, edge_gain, visited, path, path_gain);
        }
        visited[vert] = false;
        path.pop();
        path_gain /= gain;
    }

    // check if all loops of the combination are non-touching
    nonTouching(loops, combination){
        for(var i = 0; i < combination.length; i++){
            for(var j = i + 1; j < combination.length; j++){
                for(var node of loops[combination[i]][0]){
                    if(loops[combination[j]][0].indexOf(node) != -1)
                        return false;
                }
            }
        }
        return true;
    }

    // add non-touching loops to the corresponding map
    addNonTouching(loops, length, gain){
        this.delta.get(length).push({"loops": loops.map((x) => x), "gain": gain});
    }

    // produce all combinations of loops, and check if they are non-touching or not
    getCombinations(loop, length, combination, gain, all_loops, len){

        if(combination.length == length){
            if(this.nonTouching(all_loops, combination)){
                this.addNonTouching(combination, length, gain);
            }
            return;
        }

        for(var i = loop; i < len; i++){
            combination.push(i);
            gain *= all_loops[i][1];
            this.getCombinations(i+1, length, combination, gain, all_loops, len);
            combination.pop();
            gain /= all_loops[i][1];
        }

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
var g = new Graph(8);
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
 
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('A', 'B', 1);
g.addEdge('B', 'C', 2);
g.addEdge('C', 'D', 3);
g.addEdge('D', 'E', 4);
g.addEdge('E', 'F', 6);
g.addEdge('F', 'G', 5);
g.addEdge('G', 'H', 3);
g.addEdge('G', 'G', 200);
g.addEdge('C', 'B', 5);
g.addEdge('D', 'C', 5);
g.addEdge('B', 'D', 5);
g.addEdge('E', 'D', 5);
g.addEdge('F', 'E', 5);
g.addEdge('G', 'F', 5);
g.addEdge('G', 'E', 5);
g.addEdge('B', 'G', 5);




 
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
g.analyze('A', 'H');

console.log(g.forwardPaths, g.loops);
var combination = [];
var num = 2;
do {
    g.getCombinations(0, num, combination, 1, data[1], data[1].length);
    console.log(g.delta.get(num));

} while(g.delta.get(num++).length > 0)


/*else { // If visited before then a cycle is detected
                var index = 0;
                for(var i in path){
                    if(path[i][0] == node)
                        break;
                    index++;                    
                }
                // Add node as last node in the path
                path.push(nei);
                var loop = [], loop_gain = 1;
                while(index + 1 < path.length){
                    loop.push(path[index++][0]);
                    loop_gain *= path[index][1];
                }
                loop.push(path.pop()[0]);
                var obj = {"nodes" : loop, "gain" : loop_gain}
                // check not repeated
                var repeated = false;
                for(var arr of loops){
                    if(this.arraysEqual(loop, arr[0]) && loop_gain == arr[1])
                    {
                        repeated = true;
                        break;
                    }
                }
                if(!repeated) loops.push([loop, loop_gain]);
            }
        }
*/