let nodenumber=0;
const nodes = [];
let node;
let from, to, gain;
const layer = new Konva.Layer();

window.onload = function() {
  stage = new Konva.Stage({
    container: "drawing-board",
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const addNodeButton = document.querySelector('#node');
  addNodeButton.addEventListener('click', () => {
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
  });

  const clearButton = document.querySelector('#clear');
  clearButton.addEventListener('click', () => {
    clearAll();
  });

  const saveButton = document.querySelector('#save');
  saveButton.addEventListener('click', () => {
    save();
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
    x: 750,
    y: 280,
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
    layer.add(node);
    stage.add(layer);
}

function drawLine(){
  let shape1;
  let shape2;
  let first_pointx;
  let first_pointy;
  let second_pointx;
  let second_pointy;
  if(from.charAt(0) == 'X' && to.charAt(0)=='X'){
    shape1 = nodes[parseInt(from.charAt(1))];
    shape2 = nodes[parseInt(to.charAt(1))];
  } else {
    from.value='';
    to.value='';
    return;
  }
    first_pointx = (shape1.attrs.x*2+shape1.attrs.width)/2;
    first_pointy = (shape1.attrs.y*2+shape1.attrs.height)/2;
    second_pointx = (shape2.attrs.x*2+shape2.attrs.width)/2;
    second_pointy = (shape2.attrs.y*2+shape2.attrs.height)/2;
  let arrow = new Konva.Arrow({
    points: [first_pointx,first_pointy,second_pointx,second_pointy],
    stroke: 'black',
    fill: 'black'
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
  from.value='';
  to.value='';
  layer.batchDraw();
}