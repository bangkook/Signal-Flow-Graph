let nodenumber=0;
const nodes = [];
let node;
const layer = new Konva.Layer();

window.onload = function() {
  stage = new Konva.Stage({
    container: "drawing-board",
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const addNodeButton = document.querySelector('#node');
  addNodeButton.addEventListener('click', () => {
    nodes.forEach(node => {
      node.draggable(true);
    });
    drawNode();
    nodenumber++;
    nodes.push(node); // Add the new node to the list of nodes
  });

  const lineButton = document.querySelector('#line');
  lineButton.addEventListener('click', () => {
    nodes.forEach(node => {
      node.draggable(false);
    });
    drawLine();
  });

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


function drawLine() {
  stage.on('click', (e) => {
    const target = e.target;
    if (target instanceof Konva.Shape) {
      const rect = target.getClientRect();
      console.log(rect);
    } else {
      console.log('Error: No node was clicked');
    }
  });
}