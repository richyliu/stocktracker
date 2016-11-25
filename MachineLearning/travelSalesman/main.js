const MUTATION_WEIGHT = 5.5;
const HALF_POP = 8;

let best = 0;
let population = [];
let dataPoints = [];

const NODE_MAP = {
    1: [0, 4],
    2: [1, 1],
    3: [7, 3],
    4: [7, 2],
    5: [6, 0],
    6: [3, 3],
    7: [6, 6],
    8: [2, 6],
    9: [3, 7],
    10: [5, 5],
    11: [8, 8]
};
const NUM_NODES = Object.keys(NODE_MAP).length;

/*

8 .                    B
  .        9
6 .     8        7
  .           A
4 1
  .        6        3
2 .                 4
  .  2
  .  .  .  .  .  5  .  .
     2     4     6     8
*/



main();


function main() {
    population = [
        [5, 1, 3, 7, 4, 10, 11, 6, 8, 2, 9],
        [8, 1, 3, 2, 5, 9, 10, 11, 4, 6, 7],
        [3, 2, 10, 11, 9, 4, 5, 7, 6, 8, 1],
        [4, 8, 1, 7, 9, 5, 6, 3, 10, 11, 2],
        [10, 11, 5, 9, 1, 3, 7, 4, 6, 8, 2],
        [8, 1, 10, 11, 3, 9, 2, 5, 4, 6, 7],
        [9, 3, 2, 4, 10, 11, 5, 7, 6, 8, 1],
        [4, 8, 1, 7, 5, 6, 10, 11, 3, 9, 2],
        [5, 1, 3, 10, 11, 7, 4, 9, 6, 8, 2],
        [8, 1, 3, 9, 2, 5, 4, 6, 10, 11, 7],
        [3, 2, 4, 5, 7, 9, 10, 11, 6, 8, 1],
        [4, 8, 1, 7, 10, 11, 5, 6, 3, 9, 2],
        [5, 1, 10, 11, 3, 7, 4, 9, 6, 8, 2],
        [8, 1, 9, 3, 2, 5, 10, 11, 4, 6, 7],
        [3, 2, 4, 5, 7, 6, 10, 11, 8, 9, 1],
        [4, 8, 1, 10, 11, 7, 9, 5, 6, 3, 2],
    ];
    setupChart();
    
    Array.apply(null, {length: 120}).map(Number.call, Number).every((i) => {
        nextGeneration();
        
        
        // update chart
        dataPoints.push({y: best});
        
        // console.log(population);
        console.log(best);
        
        if (best === 0) return false;
        else return true;
    });
    
    chart.render();
    console.log(population);
}


function nextGeneration() {
    // copy population into array with items [route, fitness]
    let curPop = population.map(item => [item, 0]);
    
    curPop.forEach(route => {
        // calculate fitness of each route
        route[1] = getFitness(route[0]);
    });
    
    // sort routes based on fitness
    curPop.sort((a, b) => a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0));
    best = curPop[0][1];
    
    // turn back into normal array
    curPop = curPop.map(item => item[0]);
    
    // breed good parents and set child to be bad half of routes
    for (let i = 0; i < HALF_POP; i += 2) {
        const child = breed(curPop[i], curPop[i + 1]);
        
        curPop[i + HALF_POP] = mutate(child);
        curPop[i + 1 + HALF_POP] = mutate(child);
    }
    
    population = Array.from(curPop);
}


function breed(parent1, parent2) {
    //     *  *  *
    // [3, 2, 5, 6, 4, 1]
    // [2, 5, 4, 1, 3, 6]
    // [1, 2, 5, 6, 3, 4]
    
    let child = [];
    let subsetStart = randomRange(1, NUM_NODES - 2);
    let subsetEnd = randomRange(subsetStart + 1, NUM_NODES);
    let g;
    // console.log('subsetStart: ' + subsetStart);
    // console.log('subestEnd: ' + subsetEnd);
    
    // fill the child array with the subset from parent1
    child = child.concat(Array(subsetStart).fill(null));
    child = child.concat(parent1.slice(subsetStart, subsetEnd));
    child = child.concat(Array(NUM_NODES - subsetEnd).fill(null));
    g = getArrayNullIndex(child);
    // console.log(child);
    
    // loop through end of parent2 and add to child
    for (let i = 0; i < NUM_NODES; i++) {
        if (!child.includes(parent2[i])) {
            // console.log(i);
            child[g.next().value] = parent2[i];
        }
    }
    // console.log(child);
    
    function* getArrayNullIndex(array){
        for (let i = 0; i <= array.length; i++) {
            if (array[i] === null) {
                yield i;
            }
        }
    }
    
    
    return child;
}


function getFitness(route) {
    let fitness = 0;
    
    // calculate distance from segments
    for (let i = 0; i < NUM_NODES - 1; i++) {
        fitness += pointDistance(NODE_MAP[route[i]], NODE_MAP[route[i + 1]]);
    }
    
    function pointDistance(a, b) {
        const deltaX = a[0] - b[0];
        const deltaY = a[1] - b[1];
        
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    
    return fitness;
}


function mutate(route) {
    const swap1 = Math.floor(Math.random() * route.length);
    let swap2 = Math.floor(Math.random() * route.length);
    // ensures swap2 isn't the same as swap1
    while (swap2 === swap1) swap2 = Math.floor(Math.random() * route.length);
    
    const temp = route[swap1];
    route[swap1] = route[swap2];
    route[swap2] = temp;
    
    return route;
}



function setupChart() {
	chart = new CanvasJS.Chart("chartContainer",{
		title :{
			text: "Best Fitness"
		},
		data: [{
			type: "line",
			dataPoints: dataPoints
		}]
	});
}


function setupChart() {
	chart = new CanvasJS.Chart("chartContainer", {
		title :{
			text: "Best Fitness"
		},
		data: [{
			type: "line",
			dataPoints: dataPoints
		}]
	});
}


// start inclusive and end exclusive
// returns integer
function randomRange(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}