const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");



document.getElementById("gg").onclick = startVideo;

function startVideo() {
    const video = document.querySelector("video");
    const canvas = document.querySelector("canvas");
  
    canvas.style.transform = "scaleY(0.55)";
    canvas.style.transition = "1s";
  
    canvas.addEventListener("transitionend", function() {
      canvas.style.display = "none";
      video.style.display = "inline";
      video.style.transition = "1s";
      video.style.width = "550px";
      
    }, { once: true });
    video.play();
  }


canvas.addEventListener('click', mouseClick);
document.getElementById("clear").onclick = clearFunc;
document.getElementById("start").onclick = antAlgorithm;

function clearFunc(){
    location.reload();
}

let vertex = [];

function mouseClick(click){
    let clickX = click.pageX - click.target.offsetLeft;
    let clickY = click.pageY - click.target.offsetTop;
    
    context.beginPath();
    context.arc(clickX, clickY, 10, 0, 2*Math.PI, false);
    context.fillStyle = '#333';
    context.fill();

    context.beginPath();
    if (vertex.length >= 1){
        for(let vert of vertex){
            let vertX = vert[0];
            let vertY = vert[1];

            context.moveTo(vertX, vertY);
            context.lineTo(clickX, clickY);
            context.strokeStyle = "#00ffff";
            context.lineWidth = 2;
            context.stroke();
        }
    }
    vertex.push([clickX, clickY]);
    drawingPoints();
}

function drawingPoints(){
    for (let i = 0; i < vertex.length; ++i){
        context.beginPath();
        context.arc(vertex[i][0], vertex[i][1], 10, 0, 2*Math.PI, false);
        context.fillStyle = '#333';
        context.fill();
    }
}

function drawNewPath(old, neww){
    let oldPath = old.slice()
    oldPath.push(oldPath[0].slice())

    for (let i = 0; i < oldPath.length - 1; ++i){
        context.beginPath();
        let vector = [oldPath[i + 1][0] - oldPath[i][0] , oldPath[i + 1][1] - oldPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(oldPath[i][0] + vector[0], oldPath[i][1] + vector[1]);
        context.lineTo(oldPath[i + 1][0] - vector[0], oldPath[i + 1][1] - vector[1]);
        context.strokeStyle = "#00ffff";
        context.lineWidth = 2;
        context.stroke()
    }

    let newPath = neww.slice();
    newPath.push(newPath[0].slice())

    for (let i = 0; i < newPath.length - 1; ++i){
        context.beginPath();
        let vector = [newPath[i + 1][0] - newPath[i][0] , newPath[i + 1][1] - newPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(newPath[i][0] + vector[0] * 10 / s, newPath[i][1] + vector[1] * 10 / s);
        context.lineTo(newPath[i + 1][0] - vector[0] * 10 / s, newPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = "#ffa500";
        context.lineWidth = 1;
        context.stroke();
    }

}

function drawFinishPath(bestPath, color){
    bestPath.push(bestPath[0].slice());
    for (let i = 0; i < bestPath.length - 1; ++i){
        context.beginPath();
        let vector = [bestPath[i + 1][0] - bestPath[i][0] , bestPath[i + 1][1] - bestPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke()
    }
}

function delay(milliseconds){
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function distanceBetweenTwoPoints(first, second){
    return Math.sqrt(Math.pow(first[0] - second[0], 2) + Math.pow(first[1] - second[1], 2));
}

function fullLensPath(path_idx){
    let dist = 0
    for (let i = 0; i < path_idx.length - 1; ++i){
        dist += distanceBetweenTwoPoints(vertex[path_idx[i]].slice(), vertex[path_idx[i + 1]].slice());
    }
    dist += distanceBetweenTwoPoints(vertex[path_idx[path_idx.length - 1]].slice(), vertex[path_idx[0]].slice());
    return dist;
}

let evaporation = 0.64;
let alpha = 1;
let beta = 1;
let coef = 200;

async function antAlgorithm(){

    
    let indForFirstPath = [];
    let pheromones = [];
    let distance = [];
    
    for (let i = 0; i < vertex.length; ++i){
        indForFirstPath.push(i);
        pheromones[i] = new Array(vertex.length);
        distance[i] = new Array(vertex.length);
    }



    let shuffledArr = indForFirstPath.sort(function(){
        return Math.random() - 0.5;
      });
      let f = [];
      for(let i = 0; i < vertex.length; i++){
        f.push(vertex[shuffledArr[i]]);
      }




    let bestAnt = [];


    bestAnt.push(f, shuffledArr, fullLensPath(shuffledArr));

    for (let i = 0; i < vertex.length - 1; ++i){
        for (let j = i + 1; j < vertex.length; ++j){
            distance[i][j] = coef / distanceBetweenTwoPoints(vertex[i].slice(), vertex[j].slice());
            pheromones[i][j] = 0.2;
        }
    }


    let end = vertex.length * 2;

    for (let generation = 0; generation < 100000; ++generation){
        if (end === 0){
            drawFinishPath(bestAnt[0], "#ff00ff");
            break;
        }

        let ways = [];
        let path = [];
        let pathIdx = [];

        for (let ant = 0; ant < vertex.length; ++ant){
            path = [];
            pathIdx = [];

            let startVertex_idx = ant;
            let startVertex = vertex[startVertex_idx].slice();

            path.push(startVertex);
            pathIdx.push(startVertex_idx);

            while (path.length !== vertex.length){
                let sumOfDesires = 0;

                let p = [];
                for (let j = 0; j < vertex.length; ++j) {
                    if (pathIdx.indexOf(j) !== -1){
                        continue;
                    }
                    let min = Math.min(startVertex_idx, j);
                    let max = Math.max(startVertex_idx, j);
                    let desire = Math.pow(pheromones[min][max], alpha) * Math.pow(distance[min][max], beta);
                    p.push([j, desire]);
                    sumOfDesires += desire;
                }   

                for (let i = 0; i < p.length; ++i){
                    p[i][1] /= sumOfDesires;
                }

                for (let j = 1; j < p.length; ++j){
                    p[j][1] += p[j - 1][1];
                }

                let rand = Math.random()
                let choice
                for (let i = 0; i < p.length; ++i){
                    if (rand < p[i][1]){
                        choice = p[i][0];
                        break;
                    }
                }
                startVertex_idx = choice;

                startVertex = vertex[startVertex_idx].slice();
                path.push(startVertex.slice());
                pathIdx.push(startVertex_idx);
            }
            ways.push([path.slice(), pathIdx.slice(), fullLensPath(pathIdx)])
        }

        ways.sort((function (a, b) { return a[2] - b[2]}));

        for (let i = 0; i < vertex.length - 1; ++i){
            for (let j = i + 1; j < vertex.length; ++j){
                pheromones[i][j] *= evaporation;
            }
        }

        for (let i = 0; i < ways.length; ++i){
            let idx_path = ways[i][1].slice();
            let lenOfPath = ways[i][2]
            for (let j = 0; j < vertex.length - 1; ++j){
                let min = Math.min(idx_path[j], idx_path[j + 1]);
                let max = Math.max(idx_path[j], idx_path[j + 1]);
                pheromones[min][max] += coef / lenOfPath;
            }
        }

        let newBestAnt = ways[0].slice();

        if (newBestAnt[2] < bestAnt[2]){
            drawNewPath(bestAnt[0], newBestAnt[0]);
            bestAnt = newBestAnt.slice();
            drawingPoints();
            end = vertex.length * 2;
        }

        end -= 1;
        console.log(generation)
        await delay(100);
    }

}