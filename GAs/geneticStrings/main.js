const TARGET = 'hello, world';
// const MUTATION_WEIGHT = 0.087;
const MUTATION_WEIGHT = 10;
const GENERATION_SIZE = 16; //must be even!
const HALF_GENERATION_SIZE = GENERATION_SIZE / 2;

let best = 0;

let population = [
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
    ',,3,45m3,el9'
];



function main() {
    Array(10).fill(0).forEach(() => {
        nextGeneration();
        console.log(population);
        console.log(best);
    });
}

function nextGeneration() {
    // copy population into array with items [string, fitness]
    let curPopulation = population.map(item => [item, 0]);
    
    curPopulation.forEach(string => {
        // calculate fitness of each string
        string[1] = getFitness(string[0]);
    });
    
    let highestFitness = 0;
    let lowestFitness = 1000000;
    // calculate highest and lowest fitness
    curPopulation.forEach(string => {
        if (string[1] > highestFitness) highestFitness = string[1];
        if (string[1] < lowestFitness) lowestFitness = string[1];
    });
    // change fitness to relative fitness (between 0 and 1)
    curPopulation.forEach(string => {
        string[1] = (string[1] - lowestFitness) / (highestFitness - lowestFitness);
    });
    
    // sort strings based on fitness
    curPopulation.sort((a, b) => a[1] > b[1] ? 1 : (a[1] < b[1] ? -1 : 0));
    best = curPopulation[0][1] * (highestFitness - lowestFitness) + lowestFitness;
    
    // "kill" half of the strings
    curPopulation.splice(HALF_GENERATION_SIZE);
    
    // duplicate and mutate strings
    for (let i = 0; i < HALF_GENERATION_SIZE / 2; i++) {
        const parent1 = mutate(curPopulation[i * 2][0], curPopulation[i * 2][1]);
        const parent2 = mutate(curPopulation[i * 2 + 1][0], curPopulation[i * 2 + 1][1]);
        
        curPopulation[i * 2] = breed(parent1, parent2);
        curPopulation[i * 2 + 1] = breed(parent1, parent2);
    }
    
    population = Array.from(curPopulation);
}


function getFitness(string) {
    if (string === TARGET) return 0;
    
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
    if (fitness === 0) return string;
    
    string = string.split('');
    string = string.map(char => {
        const mutateAmt = Math.round((Math.random() * 2 - 1) * MUTATION_WEIGHT * fitness);
        // console.log((Math.random() * 2 - 1) * MUTATION_WEIGHT * fitness);
        // console.log(mutateAmt);
        
        
        let letterCharCode = char.charCodeAt(0) + mutateAmt;
        if (letterCharCode < 32) letterCharCode = 32;
        if (letterCharCode > 126) letterCharCode = 126;
        
        return String.fromCharCode(letterCharCode);
    });
    
    
    return string.join('');
}



String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
};


// main();