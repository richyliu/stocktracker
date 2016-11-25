const TARGET = 'hello, world';
let MUTATION_WEIGHT = 5.5;
const HALF_GENERATION_SIZE = 8;
let best = 0;
let dataPoints = [];

let chart;
let population;



String.prototype.replaceAt = (index, character) => {
    return this.substr(0, index) + character + this.substr(index + character.length);
};



setupChart();
main();


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
        population.forEach(string => {
            $('#population').append(`
                <div style="display: inline">
                    ${string}
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
    // copy population into array with items [string, fitness]
    let curPop = population.map(item => [item, 0]);
    
    curPop.forEach(string => {
        // calculate fitness of each string
        string[1] = getFitness(string[0]);
    });
    
    // sort strings based on fitness
    curPop.sort((a, b) => a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0));
    best = curPop[0][1];
    
    // "kill" half of the strings
    curPop.splice(HALF_GENERATION_SIZE);
    
    // duplicate and mutate strings (also turns back into normal array)
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


function getFitness(string) {
    let fitness = 0;
    
    for (let i = 0; i < string.length; i++) {
        fitness += Math.abs(TARGET.charCodeAt(i) - string[i].charCodeAt(0));
    }
    
    return fitness;
}


function breed(string1, string2) {
    const slicePoint = Math.floor(string1.length / 2);
    return string1.slice(0, slicePoint) + string2.slice(slicePoint, string1.length);
}


function mutate(string, fitness) {
    const mutatedness = Math.ceil(fitness / MUTATION_WEIGHT);
    const mutateLetter = Math.floor(Math.random() * string.length);
    let letterCharCode = string.charCodeAt(mutateLetter) +
        Math.floor(Math.random() * (mutatedness * 2 + 1)) - mutatedness; //gives random number between -1 and 1
    
    if (letterCharCode < 32) letterCharCode = 32;
    if (letterCharCode > 132) letterCharCode = 132;
    
    return string.replaceAt(mutateLetter, String.fromCharCode(letterCharCode));
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