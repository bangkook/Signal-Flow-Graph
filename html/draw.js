let nodenumber=0;
const nodes = [];
let node;
let from, to;
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
    console.log("from: "+from);
    console.log("to: "+to);
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
    first_pointx =  (shape1.attrs.x * 2+shape1.attrs.width)/2;
    first_pointy =  (shape1.attrs.y * 2+shape1.attrs.height)/2;
    second_pointx = (shape2.attrs.x * 2+shape2.attrs.width)/2;
    second_pointy = (shape2.attrs.y * 2+shape2.attrs.height)/2;
  let arrow = new Konva.Arrow({
    points: [first_pointx,first_pointy,second_pointx,second_pointy],
    stroke: 'black',
    fill: 'black'
  });
  layer.add(arrow);
  from.value='';
  to.value='';
  layer.batchDraw();
}