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
    console.log(nodes)
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
    var line, isDrawing = false, firstNode;
    
    stage.on('mousedown', (e) => {
      const target = e.target;
      if (target instanceof Konva.Shape) {
        const rect = target.getClientRect();
        firstNode = target;
        const startPoint = stage.getPointerPosition();
        const x = startPoint.x;
        const y = startPoint.y;
        line = new Konva.Arrow({
          points: [x, y, x, y],
          stroke: "black",
          strokeWidth: 2
        });
        layer.add(line);
        layer.draw();
        isDrawing = true;
      } else {
        isDrawing = false;
      }
    });
    
    stage.on('mousemove', (e) => {
      if (!isDrawing) {
        return;
      }
      const pos = stage.getPointerPosition();
      const x = pos.x;
      const y = pos.y;
      const points = [line.points()[0], line.points()[1], x, y];
      line.points(points);
      layer.batchDraw();
    });
    
    stage.on('mouseup', (e) => {
      const target = e.target;
      if (!isDrawing) {
        return;
      }
      console.log(e.target)
      if (!(target instanceof Konva.Shape)) {
        line.destroy();
        layer.draw();
      }
      isDrawing = false;
    });
  }
  
  
  
 