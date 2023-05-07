let nodenumber=0;
const nodes = [];
let node, layer;
let curvePx ,curvePy;
let from, to, gain;
let positionx=10;
let positiony=280;
let turn = 0;
let i = 1;
let map = new Map();
const SFG = new SignalFLowGraph(nodenumber+1);
window.onload = function() {
    stage = new Konva.Stage({
    container: "drawing-board",
    width: window.innerWidth,
    height: window.innerHeight,
  });

  layer = new Konva.Layer();
  const addNodeButton = document.querySelector('#node');
  addNodeButton.addEventListener('click', () => {
    if(nodenumber>=10){
      positionx = 670;
      positiony = 450;
    }
    drawNode();
    nodenumber++;
    nodes.push(node); // Add the new node to the list of nodes
    
    console.log(nodes)
  });

  const lineButton = document.querySelector('#line');
  lineButton.addEventListener('click', () => {
    nodes.forEach(node => {
      node.draggable(false);
    });
    from = document.getElementById("from-input").value;
    to = document.getElementById("to-input").value;
    gain = document.getElementById("gain-input").value;
    drawLine();
    SFG.printGraph();
  });

  const clearButton = document.querySelector('#clear');
  clearButton.addEventListener('click', () => {
    clearAll();
  });

  const saveButton = document.querySelector('#save');
  saveButton.addEventListener('click', () => {
    save();
  });

  const analyzeButton = document.querySelector('#analyze');
  analyzeButton.addEventListener('click', () => {
    let newWindow = window.open("", "_blank", "width=500, height=500");
    newWindow.document.open();
    SFG.analyze('X0','X' + (nodenumber-1));
    SFG.printForwardPathsAndLoops(newWindow); // Print forward paths and loops
    const mason = new Mason(SFG.forwardPaths, SFG.loops);     
    var combination = [];
    var num = 2;
    do {
        mason.getCombinations(0, num, combination, 1);
        newWindow.document.write(`<h2> ${num} Non Touching Loops:</h2>`);
        console.log(num);
        for(var loop of mason.non_touching.get(num)) {
          for(var l of loop.loops){
            newWindow.document.write(`Loop ${l+1} `);
          }
          newWindow.document.write(` Gain: ${loop.gain}`);
      }
        
    } while(mason.non_touching.get(num++).length > 0);
        mason.getNonTouchingPath();
    mason.compute(newWindow);
    newWindow.document.close();
  });
  
}

function save(){
  const dataURL = stage.toDataURL();
  const img = new Image();
  img.src = dataURL;
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = dataURL;
  link.click();
}

function clearAll(){
  if (confirm('Are you sure you want to clear all?')) {
    nodes.forEach(node => {
      node.destroy();
    });
    nodes.length = 0;
    nodenumber = 0;
    layer.destroyChildren();
    layer.clear();
    stage.add(layer);
    console.log("Cleared!!");
  }
}


function drawNode() {
  
  node = new Konva.Label({
    name: 'X' + nodenumber,
    x: positionx,
    y: positiony,
    draggable:true,
    width: 50,
    height:50,
  })
  node.add(
    new Konva.Tag({
      fill: 'white',
      stroke: "pink",
      strokeWidth: 4,
      padding: 10,
      cornerRadius: 50
    })
  )
  node.add(
    new Konva.Text({
      text: 'X' + nodenumber,
      padding: 10,
      width: 70,
      height: 70,
      fill: 'black',
      fontSize: 20,
      align: 'center',
      verticalAlign: 'middle' ,
      name: 'X'+ nodenumber,
    }))
    SFG.addVertex(node.name());
    layer.add(node);
    stage.add(layer);
    positionx=positionx+150;
}
function drawLine() {
    let shape1;
    let shape2;
    let first_pointx;
    let first_pointy;
    let second_pointx;
    let second_pointy;
    
    if (from.charAt(0) === 'X' && to.charAt(0) === 'X') {
      const index1 = parseInt(from.charAt(1));
      const index2 = parseInt(to.charAt(1));
      
      if (!map.has(index1)) {
        map.set(index1, 0);
      }
      
      if (!map.has(index2)) {
        map.set(index2, 0);
      }
      
      let firstValue = map.get(index1);
      let secondValue = map.get(index2);
      
      // Increment values
      map.set(index1, firstValue + 1);
      map.set(index2, secondValue + 1);
      
      console.log(map);
      shape1 = nodes[index1];
      shape2 = nodes[index2];
      first_pointx = (shape1.attrs.x * 2 + shape1.attrs.width) / 2;
      first_pointy = (shape1.attrs.y * 2 + shape1.attrs.height) / 2;
      second_pointx = (shape2.attrs.x * 2 + shape2.attrs.width) / 2;
      second_pointy = (shape2.attrs.y * 2 + shape2.attrs.height) / 2;

      if((map.get(index1) == 1 || map.get(index2) == 1) &&( (index2 - index1) == 1 || (index2 - index1) == -1 )){
        let arrow = new Konva.Arrow({
          points: [first_pointx, first_pointy, second_pointx, second_pointy],
          stroke: 'black',
          fill: 'black',
          tension: 0.5 // set tension to a non-zero value to create a curve
          
        });
      
        let text = new Konva.Text({
            text: gain,
            x: (first_pointx + second_pointx) / 2,
            y: (first_pointy + second_pointy) / 2,
            fontSize: 20,
            fill: 'blue',
            listening: false // disable event listening to avoid interfering with the arrow shape
          });
        layer.add(arrow);
        layer.add(text);
        from.value = '';
        to.value = '';
        layer.batchDraw();
         console.log("case 1");
      }else{
        if(turn){
          curvePx =  (first_pointx + second_pointx)/2 
          curvePy =  (first_pointy + second_pointy)/2  + -50 * Math.max(map.get(index1),map.get(index2))
          turn=0;
       }else{
          curvePx =  (first_pointx + second_pointx)/2 
          curvePy =  (first_pointy + second_pointy)/2  + 50 * Math.max(map.get(index1),map.get(index2))
          turn=1;
       }
        if(index1 == index2){
           
           arrow = new Konva.Arrow({
              points: [first_pointx, first_pointy,curvePx ,curvePy ,curvePx + 70 ,curvePy,second_pointx, second_pointy],
              stroke: 'black',
              fill: 'black',
              tension: 0.5 // set tension to a non-zero value to create a curve
            });
          let text = new Konva.Text({
            text: gain,
            x: curvePx ,
            y: curvePy,
            fontSize: 20,
            fill: 'blue',
            listening: false // disable event listening to avoid interfering with the arrow shape
          });
        layer.add(arrow);
        layer.add(text);
        from.value = '';
        to.value = '';
        layer.batchDraw();

        } else{

            let arrow = new Konva.Arrow({
                points: [first_pointx, first_pointy,curvePx ,curvePy ,second_pointx, second_pointy],
                stroke: 'black',
                fill: 'black',
                tension: 0.5 // set tension to a non-zero value to create a curve
              });
              let text = new Konva.Text({
                text: gain,
                x: curvePx,
                y: curvePy,
                fontSize: 20,
                fill: 'blue',
                listening: false // disable event listening to avoid interfering with the arrow shape
              });
              layer.add(arrow);
              layer.add(text);
              from.value = '';
              to.value = '';
              layer.batchDraw();
      }
    }

    } else {
      from.value = '';
      to.value = '';
      return;
    }
    SFG.addEdge(shape1.name(), shape2.name(), gain);
    SFG.getAdjList();
  }