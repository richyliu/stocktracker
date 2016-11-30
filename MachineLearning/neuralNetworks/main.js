let chart;


let dataPoints = [];
let population = [];



setupChart();
main();



function main() {
    Array.apply(null, {length: 100}).map(Number.call, Number).forEach(i => {
        dataPoints.push({x: i - 50, y: sigmoid(i - 50)});
    });
    chart.render();
}


function sigmoid(x) {
    return 1 / (1 + Math.pow(Math.E, -x));
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