const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.addEventListener('click', mouseClick);
document.getElementById("clear").onclick = clearFunc;
document.getElementById("start").onclick = mainAlg;
let vertexes = [];




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function clearFunc(){
    location.reload();
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function wait(time){
    return new Promise(resolve => setTimeout(resolve, time));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function mouseClick(click){
    let pointForCanvasX = click.pageX - click.target.offsetLeft;
    let pointForCanvasY = click.pageY - click.target.offsetTop;

    context.beginPath();
    if (vertexes.length >= 1){
        for(let i of vertexes){
            let vertX = i[0];
            let vertY = i[1];

            let vector = [pointForCanvasX - vertX , pointForCanvasY - vertY];
            let string = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
            context.moveTo(vertX + vector[0] * 10 / string, vertY + vector[1] * 10 / string);

            context.lineTo(pointForCanvasX, pointForCanvasY);
            context.strokeStyle = "#808080";
            context.stroke();
        }
    }

    context.beginPath();
    context.arc(pointForCanvasX, pointForCanvasY, 10, 0, 2*Math.PI, false);
    context.fillStyle = 'orange';
    context.fill();

    vertexes.push([pointForCanvasX, pointForCanvasY]);
    redrawVertexes();
}

function redrawVertexes(){
    for (let i = 0; i < vertexes.length; ++i){
        context.beginPath();
        context.arc(vertexes[i][0], vertexes[i][1], 10, 0, 2*Math.PI, false);
        context.fillStyle = 'orange';
        context.fill();
    }
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function FinishTour(bestPath, color){
    console.log(bestPath.slice())
    bestPath.splice(bestPath.length - 1, 0, bestPath[0].slice())
    console.log(bestPath.slice())
    for (let i = 0; i < bestPath.length - 2; ++i){
        context.beginPath();
        let vector = [bestPath[i + 1][0] - bestPath[i][0] , bestPath[i + 1][1] - bestPath[i][1]];
        let s = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = '#000080';
        context.lineWidth = 2;
        context.stroke();

        context.moveTo(bestPath[i][0] + vector[0] * 10 / s, bestPath[i][1] + vector[1] * 10 / s);
        context.lineTo(bestPath[i + 1][0] - vector[0] * 10 / s, bestPath[i + 1][1] - vector[1] * 10 / s);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke()
    }
}

function shuffle(array) {
    let a = array.slice()
    for (let i = 0; i < vertexes.length - 1; ++i) {
        let r1 = randomNumber(1, vertexes.length - 1);
        let r2 = randomNumber(1, vertexes.length - 1);
        [a[r1], a[r2]] = [a[r2], a[r1]];
    }
    return a.slice();
}

function startPopulation(firstGeneration){
    let res = [];
    let buffer = firstGeneration.slice();
    buffer.push(distance(buffer));
    res.push(buffer.slice());

    for (let i = 0; i < vertexes.length * vertexes.length; ++i){
        buffer = firstGeneration.slice();
        buffer = shuffle(buffer)
        buffer.push(distance(buffer));
        res.push(buffer.slice())
    }
    return res;
}



function distance(chromosome){
    let ans = 0;
    for (let i = 0; i < chromosome.length - 1; ++i){
        ans += Math.sqrt(Math.pow(chromosome[i][0] - chromosome[i + 1][0], 2) + Math.pow(chromosome[i][1] - chromosome[i + 1][1], 2));
    }
    ans += Math.sqrt(Math.pow(chromosome[chromosome.length - 1][0] - chromosome[0][0], 2) + Math.pow(chromosome[chromosome.length - 1][1] - chromosome[0][1], 2));
    return ans;
}

function twoRandomNumbers(min, max){
    let a = Math.floor(Math.random() * (max - min) + min);
    let b = Math.floor(Math.random() * (max - min) + min);
    while (a === b){
        a = Math.floor(Math.random() * (max - min) + min);
    }
    return [a, b];
}

function randomNumber(min, max){
    return  Math.floor(Math.random() * (max - min) + min);
}
let chanceOfMutation = 30;
function cross(first, second){
    let child = [];
    let index1 = randomNumber(0, first.length);
    let index2 = randomNumber(index1 + 1, first.length);
    child = first.slice(index1, index2 + 1);

    for (let num of second) {
        if (!child.includes(num)) {
            child.push(num);
        }
    }

    if (Math.random() * 100 < chanceOfMutation){
        let rand = twoRandomNumbers(1, lengthOfChromosome);
        let i = rand[0], j = rand[1];
        [child[i], child[j]] = [child[j], child[i]];
    }

    return child;
}

function crossingParents(firstParent, secondParent){
    let firstChild = cross(firstParent, secondParent);
    let secondChild = cross(firstParent, secondParent);

    firstChild.push(distance(firstChild.slice()))
    secondChild.push(distance(secondChild.slice()))
    return [firstChild, secondChild];
}

function drawLines(Chromosome, population){
    Chromosome.splice(Chromosome.length - 1, 0, Chromosome[0].slice())
    for (let i = 0; i < Chromosome.length - 1; ++i){
        context.beginPath();
        let vector = [Chromosome[i + 1][0] - Chromosome[i][0] , Chromosome[i + 1][1] - Chromosome[i][1]];
        let str = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);

        context.moveTo(Chromosome[i][0] + vector[0] * 10 / str, Chromosome[i][1] + vector[1] * 10 / str);
        context.lineTo(Chromosome[i + 1][0] - vector[0] * 10 / str, Chromosome[i + 1][1] - vector[1] * 10 / str);
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.stroke();

        context.moveTo(Chromosome[i][0] + vector[0] * 10 / str, Chromosome[i][1] + vector[1] * 10 / str);
        context.lineTo(Chromosome[i + 1][0] - vector[0] * 10 / str, Chromosome[i + 1][1] - vector[1] * 10 / str);
        context.strokeStyle = '#808080';
        context.lineWidth = 2;  
        context.stroke()
    }
    population.splice(population.length - 1, 0, population[0].slice())
    for (let q = 0; q < population.length - 1; ++q){
        context.beginPath();
        let vector = [population[q + 1][0] - population[q][0] , population[q + 1][1] - population[q][1]];
        let str = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        context.moveTo(population[q][0] + vector[0] * 10 / str, population[q][1] + vector[1] * 10 / str);
        context.lineTo(population[q + 1][0] - vector[0] * 10 / str, population[q + 1][1] - vector[1] * 10 / str);
        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.stroke();
    }

}

let numberOfGenerations = 100000;
let lengthOfChromosome;
async function mainAlg(){
    let firstGeneration = [];
    let end = 500;
// Создаем первое поколение особей, на основе вершин графа
    for (let i = 0; i < vertexes.length; ++i){
        firstGeneration.push(vertexes[i]);
    }
// Определяем длину хромосомы как количество вершин в графе
    lengthOfChromosome = firstGeneration.length;

// Создаем популяцию и сортируем ее по возрастанию по последнему значению хромосомы
    let population = startPopulation(firstGeneration);
    population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1]}));
// Инициализируем лучшую хромосому и рисуем ее
    let bestChromosome = population[0].slice();
    FinishTour(bestChromosome, '#FF1493')
// Главный цикл, в котором создаются новые поколения и осуществляется отбор наилучших хромосом
    for(let i = 0; i < numberOfGenerations; ++i)
    {
        if (end === 0){
// Если число поколений исчерпано, выводим лучшую хромосому и прекращаем работу функции
        FinishTour(bestChromosome, '#8B008B')
            break;
        }
// Оставляем только vertexes.length * vertexes.length лучших хромосом из популяции
        population = population.slice(0, vertexes.length * vertexes.length);
// Создаем новые хромосомы, используя операцию скрещивания на основе двух случайных родителей
        for (let j = 0; j < vertexes.length * vertexes.length; ++j){
            let index1 = randomNumber(0, population.length);
            let index2 = randomNumber(0, population.length);
            let firstParent = population[index1].slice(0, population[index1].length - 1);
            let secondParent = population[index2].slice(0, population[index2].length - 1);

            let child = crossingParents(firstParent, secondParent);
            population.push(child[0].slice())
            population.push(child[1].slice())
            
        }
// Сортируем популяцию по возрастанию последнего значения хромосомы
population.sort((a, b) => a[a.length - 1] - b[b.length - 1]);
// Если лучшая хромосома изменилась, рисуем новый путь и обновляем лучшую хромосому
        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])){
            drawLines(bestChromosome, population[0])
            bestChromosome = population[0].slice();
            end = 500;
            
        }
        if (i % 100 === 0){
            end -= 100;
        }

        redrawVertexes();
        await wait(0);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
Population - популяция с измененными маршрутами (элемент списка имеет тип Tour).
BestTour - лучший маршрут в популяции (свойство класса Population, имеет тип Tour).
lastIterationValue - номер итерации (поколения) получения последнего лучшего маршрута (тип int).
lastFitnessValue - длина последнего лучшего маршрута (тип double).
impr  число улучшений решения (тип int).
Рисунок последнего лучшего маршрута.
*/
