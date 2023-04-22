const paddingJS = 5;
const wall_color = "black";
const free_color = "white";
const path_color = "#0d6073";
const neighbor_color = "#072c33";
const clasedCelll_color = "#7d9296";
const startCelll_color = "#DC143C";
const finishCelll_color = "#8B008B";
// const startCelll_color = "#c2ced1";
// const finishCelll_color = "#c6b8cc";
const background = "#1C1C1C";

const tractor_color = "red";
let animation = document.getElementById('animation');;

const tractors_number = 30;
let colums = document.getElementById("sizeM").value;

const delay_timeout = 10;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let cell_size = (canvas.width - paddingJS * 2) / colums;

var canva = document.getElementById('canvas');
var canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
var canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum; 
canvas.height = canvas.width; 

let startClicked = false;
let finishClicked = false;
let freeClicked = false;
let wallClicked = false;
let found = false;

let graph = [];

let tractors = [];
let matrix = createMatrix(colums, colums);

const mouse = createMouse(canvas);

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let startCell = new Cell(null, null);
let finishCell = new Cell(null, null);

const start = document.getElementById('start');
const finish = document.getElementById('finish');
const free = document.getElementById('free');
const wall = document.getElementById('wall');
const begin = document.getElementById('begin');

matrix[0][0] = true;

class Node {
  constructor(g, parent = Node, position = Cell) {
    this.parent = parent;
    this.position = position;
    this.g = g;
    this.h = finishCell.x - position.x + finishCell.y - position.y;
    this.f = this.h + this.g;
  }
  forCell(other) {
    return (this.position.x == other.x && this.position.y == other.y);
  }
  forNode(other) {
    return (this.position.x == other.position.x && this.position.y == other.position.y);
  }
}

let open = [];
let close = [];

function refresh() {
  found = false;
  open = [];
  close = [];
  colums = document.getElementById("sizeM").value;
  matrix = createMatrix(colums, colums);
  startCell = new Cell(null, null);
  finishCell = new Cell(null, null);
  startClicked = false;
  finishClicked = false;
  freeClicked = false;
  wallClicked = false;
  cell_size = (canvas.width - paddingJS * 2) / colums;
  tractors = [];
  for (let i = 0; i < tractors_number; i++) {
    tractors.push({
      x: 0,
      y: 0,
    });
  }
  main();
}

document.addEventListener('DOMContentLoaded', function () {
  refresh();
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Enter') {
    refresh();
  }
});
begin.addEventListener('click', function () {
  if (startCell.x!=null&&finishCell.x!=null)
  {
    astar();

  }

});
async function returnPath(finalNode) {
  let temp = finalNode.parent
  while (temp.parent != null) {
    drawCanvas(temp.position.x, temp.position.y, path_color);
    temp = temp.parent;
    await delay(30);
  }
};

async function main() {
  while (!isValidMaze()) {
    for (const tractor of tractors) {
      moveTractor(tractor);
    }
    if (animation.checked) {
      drawMaze();
      for (const tractor of tractors) {
        drawCanvas(tractor);
      }
      await delay(delay_timeout);
    }
  }
  if (colums % 2 == 0) {
    even();
  }
  drawMaze();
  requestAnimationFrame(tick);

}

async function even() {
  let directions = [];
  for (let i = 0; i < colums; i++) {
    if (matrix[colums - 2][i]) {
      directions.push(i);
    }
    else {
      matrix[colums - 1][getRandomItem(directions)] = true;
      directions = [];
      if (animation.checked) {
      drawMaze();
      await delay(100);
      }
    }
  }
  directions = []
  for (let i = 0; i < colums; i++) {
    if (matrix[i][colums - 2]) {
      directions.push(i);
    }
    if (!matrix[i][colums - 2] || i == colums - 1) {
      matrix[getRandomItem(directions)][colums - 1] = true;
      directions = [];
      if (animation.checked) {
      drawMaze();
      await delay(100);
      }
    }
  }

}

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function createMatrix(colums, rows) {
  const matrix = [];
  for (let y = 0; y < rows; y++) {
    const row = [];

    for (let x = 0; x < colums; x++) {
      row.push(false);
    }
    matrix.push(row);
  }
  return matrix;
}

function drawMaze() {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background;
  context.fill();
  for (let y = 0; y < colums; y++) {
    for (let x = 0; x < colums; x++) {
      const color = matrix[y][x] ? free_color : wall_color;
      drawCanvas(x, y, color);
    }
  }
  if (startCell.x != null) {
    drawCanvas(startCell.x, startCell.y, startCelll_color);
  }
  if (finishCell.x != null) {
    drawCanvas(finishCell.x, finishCell.y, finishCelll_color);
  }

}

function drawCanvas(x, y, color) {
  context.beginPath();
  context.rect(
    paddingJS + x * cell_size,
    paddingJS + y * cell_size,
    cell_size,
    cell_size
  );
  context.fillStyle = color;
  context.fill();
}

function moveTractor(tractor) {
  const directions = [];
  if (tractor.x > 1) {
    directions.push([-2, 0]);
  }
  if (tractor.x < colums - 2) {
    directions.push([2, 0]);
  }
  if (tractor.y > 1) {
    directions.push([0, -2])
  }
  if (tractor.y < colums - 2) {
    directions.push([0, 2]);
  }

  const [dx, dy] = getRandomItem(directions);

  tractor.x += dx;
  tractor.y += dy;

  if (!matrix[tractor.y][tractor.x]) {
    matrix[tractor.y][tractor.x] = true;
    matrix[tractor.y - dy / 2][tractor.x - dx / 2] = true;
  }
}

function getRandomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index]
}

function isValidMaze() {
  for (let y = 0; y < colums; y += 2) {
    for (let x = 0; x < colums; x += 2) {
      if (!matrix[y][x]) {
        return false;
      }
    }
  }
  return true;
}
function createMouse(element) {
  const mouse = {
    x: 0,
    y: 0,
    left: false,
    pLeft: false,
    over: false,
    update() {
      this.pLeft = this.left;
    },
  };

  element.addEventListener("mouseenter", mouseenterHandler);
  element.addEventListener("mouseleave", mouseleaveHandler);
  element.addEventListener("mousemove", mousemoveHandler);
  element.addEventListener("mousedown", mousedownHandler);
  element.addEventListener("mouseup", mouseupHandler);

  function mouseenterHandler() {
    mouse.over = true;
  }
  function mouseleaveHandler() {
    mouse.over = false;
  }
  function mousemoveHandler(event) {
    const rect = element.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }

  function mousedownHandler(event) {
    mouse.left = true;
  }
  function mouseupHandler(event) {
    mouse.left = false;
  }

  return mouse;
}

function compareF(a, b) {
  return a.f - b.f;
};

async function check(neighbor) {
  if (neighbor.forCell(finishCell)) {
    return;
  }
  if (close.find(node => node.forNode(neighbor))) {
    return;
  }
  if (!open.find(node => node.forNode(neighbor))) {
    open.push(neighbor);
    drawCanvas(neighbor.position.x, neighbor.position.y, neighbor_color);
  }
  else {
    if (open.find(node => node.forNode(neighbor)).g > neighbor.g) {
      open = open.filter(node => !(node.forNode(neighbor)));
      open.push(neighbor);
      drawCanvas(neighbor.position.x, neighbor.position.y, neighbor_color);
    }
  }
  await delay(delay_timeout);
}
async function astar() {
  if (found) {
    return;
  }
  var startNode = new Node;
  startNode.g = 0;
  startNode.parent = null;
  startNode.position = startCell;
  open.push(startNode);
  while (!found && open.length > 0) {
    open.sort(compareF);

    let nowNode = open.shift();
    let i = nowNode.position.y;
    let j = nowNode.position.x;
    console.log(nowNode.g);
    close.push(nowNode);
    if (!nowNode.forCell(startCell)) {
      drawCanvas(nowNode.position.x, nowNode.position.y, clasedCelll_color);
    }
    if (i > 0 && matrix[i - 1][j]) {
      let position = new Cell(j, i - 1);
      let neighbor = new Node(nowNode.g + 1, nowNode, position);
      if (neighbor.forCell(finishCell)) {
        found=true;
        returnPath(neighbor);
        break;
      }
      check(neighbor);
    }

    if (i < colums - 1 && matrix[i + 1][j]) {
      let position = new Cell(j, i + 1);
      let neighbor = new Node(nowNode.g + 1, nowNode, position);
      if (neighbor.forCell(finishCell)) {
        found=true;
        returnPath(neighbor);
        break;
      }
      check(neighbor);
    }

    if (j > 0 && matrix[i][j - 1]) {
      let position = new Cell(j - 1, i);
      let neighbor = new Node(nowNode.g + 1, nowNode, position);
      if (neighbor.forCell(finishCell)) {
        found=true;
        returnPath(neighbor);
        break;
      }
      check(neighbor);
    }

    if (j < colums - 1 && matrix[i][j + 1]) {
      let position = new Cell(j + 1, i);
      let neighbor = new Node(nowNode.g + 1, nowNode, position);
      if (neighbor.forCell(finishCell)) {
        found=true;
        returnPath(neighbor);
        break;
      }
      check(neighbor);
    }

    await delay(delay_timeout);
  }
  
  if (!found){
    await delay(100);
    alert("You are cringe 🥰");
  }
}

function tick() {
  start.addEventListener('click', function () {
    startClicked = true;
    finishClicked = false;
    freeClicked = false;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (startClicked && !finishClicked && !freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x] && (finishCell.x != x || finishCell.y != y)) {
          startCell.x = x;
          startCell.y = y;
          drawMaze();
        }
      }
    });

  });

  finish.addEventListener('click', function () {
    startClicked = false;
    finishClicked = true;
    freeClicked = false;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && finishClicked && !freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x] && (startCell.x != x || startCell.y != y)) {
          finishCell.x = x;
          finishCell.y = y;
          drawMaze();
        }
      }

    });
  });

  wall.addEventListener('click', function () {
    startClicked = false;
    finishClicked = false;
    freeClicked = false;
    wallClicked = true;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && !finishClicked && !freeClicked && wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x]) {
          matrix[y][x] = false;
          drawMaze();
        }
      }

    });
  });

  free.addEventListener('click', function () {
    startClicked = false;
    finishClicked = false;
    freeClicked = true;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && !finishClicked && freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (!matrix[y][x]) {
          matrix[y][x] = true;
          drawMaze();
        }
      }

    });
  });

}
