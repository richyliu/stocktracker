let MUTATION_WEIGHT = 5.5;
const HALF_GENERATION_SIZE = 8;

let best = 0;
let population;

const NUM_NODES = 5;
const NODE_MAP = {
    1: {
        2: 20,
        3: 5,
        4: 10,
        5: 5
    },
    2: {
        1: 20,
        3: 30,
        4: 20,
        5: 10,
    },
    3: {
        1: 5,
        2: 30,
        4: 15,
        5: 10
    },
    4: {
        1: 10,
        2: 20,
        3: 15,
        5: 5,
    },
    5: {
        1: 5,
        2: 10,
        3: 10,
        4: 5,
    }
};



// main();


function main() {
    population = [
        'a rstast f67',
        'cvrfaxc92,v7',
        'z3,x08zorinl',
        'z8xclm,5inus',
        'nxcuyn3epnos',
        'aarst stffxf',
        'cvrf xc92,!s',
        'z3,x08zori%a',
        'cu3 s9x f3 9',
        ',,3,45m3,el9',
        'cvrf xc92,!s',
        'z3,x08zori%a',
        'cu3 s9x f3 9',
        ',,3,45m3,el9',
        'z,3,45m3,el9',
        ',s3,45m2,el9'
    ];
    
    Array.apply(null, {length: 120}).map(Number.call, Number).every((i) => {
        nextGeneration();
        
        // update chart
        dataPoints.push({y: best});
        
        $('#generation').html(parseInt($('#generation').html()) + 1);
        $('#population').html('');
        population.forEach(route => {
            $('#population').append(`
                <div style="display: inline">
                    ${route}
                </div>
            `);
        });
        $('#best').html(best);
        
        // console.log(population);
        // console.log(best);
        
        if (best === 0) return false;
        else return true;
    });
    chart.render();
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
    
    // "kill" half of the routes
    curPop.splice(HALF_GENERATION_SIZE);
    
    // duplicate and mutate routes (also turns back into normal array)
    for (let i = 0; i < HALF_GENERATION_SIZE; i += 2) {
        const child = breed(curPop[i][0], curPop[i + 1][0]);
        const fitness = (curPop[i][1] + curPop[i + 1][1]) / 2;
        
        curPop[i] = mutate(child, fitness);
        curPop[i + 1] = mutate(child, fitness);
        curPop[i + HALF_GENERATION_SIZE] = mutate(child, fitness);
        curPop[i + HALF_GENERATION_SIZE + 1] = mutate(child, fitness);
    }
    
    console.log(Math.ceil(best / MUTATION_WEIGHT));
    population = Array.from(curPop);
}


function getFitness(route) {
    let fitness = 0;
    let segments = [];
    
    // get segments
    for (let i = 0; i < route.length; i++) {
        segments.push([route[i], route[i + 1]]);
    }
    
    // calculate distance from segments
    segments.forEach((segment) => {
        fitness += NODE_MAP[segment[0]][segment[1]];
    });
    
    return fitness;
}


function breed(route1, route2) {
    const slicePoint = Math.floor(route1.length / 2);
    return route1.slice(0, slicePoint) + route2.slice(slicePoint, route1.length);
}


function mutate(route, fitness) {
    const mutatedness = Math.ceil(fitness / MUTATION_WEIGHT);
    const mutateLetter = Math.floor(Math.random() * route.length);
    let letterCharCode = route.charCodeAt(mutateLetter) +
        Math.floor(Math.random() * (mutatedness * 2 + 1)) - mutatedness; //gives random number between -1 and 1
    
    if (letterCharCode < 32) letterCharCode = 32;
    if (letterCharCode > 132) letterCharCode = 132;
    
    return route.replaceAt(mutateLetter, route.fromCharCode(letterCharCode));
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