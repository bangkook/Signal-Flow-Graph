class Graph {
    // defining vertex array and
    // adjacent list
    constructor(noOfVertices)
    {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
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
        path.push([vert, gain]);
        path_gain *= gain; // Multiply gain through the path

        // If we reached the destination node, we found a forward path
        if(vert == dest)
            paths.push({"nodes": path.map((x) => x[0]), "gain" : path_gain});

        var neighbours = this.AdjList.get(vert);
        for (var nei of neighbours) {
            var node = nei[0], edge_gain = nei[1];
            if (!visited[node])
                this.DFSUtil(node, edge_gain, dest, visited, path, paths, loops, path_gain);
            else { // If visited before then a cycle is detected
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
                console.log(obj)
                // check not repeated
                loops.push([loop, loop_gain]);
            }
        }

        visited[vert] = false;
        path_gain /= gain;
        path.pop();
    }

    nonTouching(loops, combination=[]){
        var non_touching_loops = new Map();
        var two_loops = [];
        for(var i = 0; i < combination.length; i++){
            for(var j = i + 1; j < combination.length; j++){
                var non_touching = true;
                for(var node of loops[i][0]){
                    if(loops[j][0].indexOf(node) != -1)
                        return false;
                }
            }
        }
        return true;
    }

    addNonTouching(loops, length, gain){
        this.delta.get(length).push({"loops": loops.map((x) => x), "gain": gain});
    }

    getCombinations(loop, length, combination, gain, all_loops, len){
        console.log(combination, all_loops)

        if(combination.length == length){
            console.log(combination)
            if(this.nonTouching(combination)){
                this.addNonTouching(combination, length, gain);
            }
            return;
        }

        for(var i = loop; i < len; i++){
            console.log(i)
            combination.push(i);
            gain *= all_loops[i][1];
            this.getCombinations(i+1, length, combination, gain, all_loops, len);
            combination.pop();
            gain /= all_loops[i][1];
        }

    }
    getDelta(non_touching, loops)
    {
        for(var num = 2; ;num++){// 1 => {[1,2], [2, 3]}
            if(this.delta.get(num).length == 0)
                break;

            var l = this.delta.get(num);//[1, 2], [2, 3]

            for(var k of l){//[1, 2]

                var common = non_touching.get(k[0])

                for(var f of k){
                    common = common.filter(function(n) {
                        return non_touching.get(f).indexOf(n) !== -1;
                    });
                }

                var arr = k.map((x) => x);
                for(var comm of common){
                    arr.push(comm);
                    this.delta.get(num+1).push(arr.map((x) => x));
                    arr.pop();
                }
            }
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
g.addEdge('E', 'D', 3);
g.addEdge('C', 'B', 2);
g.addEdge('G', 'F', 5);



 
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
data = g.dfs('A', 'G');
console.log("LOOPS", data[1].length);
for(var paths of data)
    //console.log(paths, paths.length);

var combination = [];
g.getCombinations(0, 3, combination, 1, data[1], data[1].length);
console.log(g.delta.get(1));
console.log(g.delta.get(2));

console.log(g.delta.get(3));

console.log(g.delta.get(4));

