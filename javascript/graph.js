class SignalFLowGraph {

    constructor(noOfVertices)
    {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
        this.forwardPaths = [];
        this.loops = [];
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
        this.AdjList.get(v).push([w, weight]);
    }

    getAdjList() {
        return this.AdjList;
    }

    // Use DFS to get all forward paths and loops
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

 class Mason{
    constructor(forwardPaths, loops)
    {
        this.forwardPaths = forwardPaths;
        this.loops = loops;
        this.non_touching = new Map();
        this.non_touching_paths = new Array(forwardPaths.length);
        this.delta = new Map();
        for(var i = 0; i < 100; i++)
            this.non_touching.set(i, []);

    }

     // check if all loops of the combination are non-touching
     isNonTouching(combination){
        for(var i = 0; i < combination.length; i++){
            for(var j = i + 1; j < combination.length; j++){
                for(var node of this.loops[combination[i]][0]){
                    if(this.loops[combination[j]][0].indexOf(node) != -1)
                        return false;
                }
            }
        }
        return true;
    }

    // add non-touching loops to the corresponding map
    addNonTouching(loops, length, gain){
        this.non_touching.get(length).push({"loops": loops.map((x) => x), "gain": gain});
    }

    // produce all combinations of loops, and check if they are non-touching or not
    getCombinations(loop, length, combination, gain){

        if(combination.length == length){
            if(this.isNonTouching(combination)){
                this.addNonTouching(combination, length, gain);
            }
            return;
        }

        for(var i = loop; i < this.loops.length; i++){
            combination.push(i);
            gain *= this.loops[i][1];
            this.getCombinations(i + 1, length, combination, gain);
            combination.pop();
            gain /= this.loops[i][1];
        }

    }

    getNonTouchingPath(){
        var idx = 0, num = 1;
        for(var path of this.forwardPaths) {
            this.non_touching_paths[idx] = new Map();
            for(var j = 0; j < 100; j++)
                this.non_touching_paths[idx].set(j, []);
            for(var i = 0; i < this.loops.length; i++){
                var nonTouching = true;
                for(var node of this.loops[i][0]){
                    if(path.nodes.indexOf(node) != -1){
                        nonTouching = false;
                        break;
                    }
                }
                if(nonTouching)
                    this.non_touching_paths[idx].get(num).push({"loops": i, "gain": this.loops[i][1]});
            }
            idx++;
        }

        for(var idx in this.forwardPaths){
            //Loops not intersecting with path
            var path_loops = this.non_touching_paths[idx].get(1); 
            for(var num = 2; num < 100; num++){
                var loops = this.non_touching.get(num);
                if(loops.length == 0)
                    break;
                for(var data of loops){
                    var indeces = data.loops, cnt = 0;
                    for(var index of path_loops){
                        if(indeces.indexOf(index.loops) != -1)
                            cnt++;
                    }
                    if(cnt < indeces.length){
                        continue;
                    }
                    this.non_touching_paths[idx].get(num).push(data);
                }
            }
            //console.log(idx, this.non_touching_paths[idx]);
        }
    }

    compute(){
        var transfer_function = 0;

        var delta = 1;
        var gain_sum = 0;
        for(var loop of this.loops)
            gain_sum += loop[1];
        delta -= gain_sum;
        var num = 2;
        var non_touching_loops = this.non_touching.get(num);
        while(non_touching_loops.length > 0){
            gain_sum = 0;
            var sign = 1;
            for(var loop of non_touching_loops){
                gain_sum += loop.gain;
            }
            delta += sign * gain_sum;
            sign = -sign;
            non_touching_loops = this.non_touching.get(++num);
        }

        //delta for each forward path
        var delta_i = new Array(this.forwardPaths.length).fill(1);
        for(var path in this.forwardPaths){
            num = 1;
            non_touching_loops = this.non_touching_paths[path].get(num);
            while(non_touching_loops.length > 0){
                gain_sum = 0;
                var sign = -1;
                for(var loop of non_touching_loops){
                    gain_sum += loop.gain;
                }
                delta_i[path] += sign * gain_sum;
                sign = -sign;
                non_touching_loops = this.non_touching_paths[path].get(++num);
            }
            transfer_function += this.forwardPaths[path].gain * delta_i[path];
        }

        return transfer_function / delta;
    }
    
}
var g = new SignalFLowGraph(9);
var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
 
// adding vertices
for (var i = 0; i < vertices.length; i++) {
    g.addVertex(vertices[i]);
}
 
// adding edges
g.addEdge('A', 'B', 1);
g.addEdge('B', 'C', 1);
g.addEdge('C', 'D', 1);
g.addEdge('D', 'E', 1);
g.addEdge('E', 'F', 1);
g.addEdge('F', 'G', 1);
g.addEdge('G', 'H', 1);
g.addEdge('H', 'I', 1);
g.addEdge('F', 'H', 1);
g.addEdge('H', 'F', -1);
g.addEdge('D', 'G', 1);
g.addEdge('F', 'E', -1);
g.addEdge('G', 'C', -1);
g.addEdge('H', 'B', -1);




 
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
g.analyze('A', 'I');
console.log(g.forwardPaths, g.loops);
var mason = new Mason(g.forwardPaths, g.loops);
var combination = [];
var num = 2;
do {
    mason.getCombinations(0, num, combination, 1);
    console.log(mason.non_touching.get(num));

} while(mason.non_touching.get(num++).length > 0);
mason.getNonTouchingPath();
console.log(mason.compute());
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