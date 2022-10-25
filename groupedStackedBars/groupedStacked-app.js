// Chart dimensions
let dim = {
    'width': window.innerWidth * 0.7,
    'height': window.innerHeight * 0.8,
    'margin': window.innerHeight * 0.10
}

let n = 5;   // number of series
let m = 50;  // number of values per series

// Returns an array of m random, smoothly varying non negative number
// to simulate some data
function bumps(m) {
    const values = [];

    // Initialize with uniform random values in [0.1, 0.2]
    for (let i = 0; i < m; ++i) {
        values[i] = 0.1 + 0.1 * Math.random();
    }

    // Add  up to five random bumps
    for (let j = 0; j < 5; ++j) {
        const x = 1 / (0.1 + Math.random()); // 0.9 < x < 10
        const y = 2 * Math.random() - 0.5; // -0.5 < y < 1.5
        const z = 10 / (0.1 + Math.random()); // 9 < z < 100

        // Generate an arithmetic sequence w of length m
        // difference between the first and last terms is approx. z
        // Multiply x by e^(-w^2), which is almost 0 for |w| > 2
        // and has a bell shape in the range |w| < 2.
        // A bump will therefore be added when the arithmetic sequence
        // happens to cross the values between -2 and 2 
        for (let i = 0; i < m; i++) {
            const w = (i / m - y) * z; // -150 < z < 50 + 100j/m
            values[i] += x * Math.exp(-w * w);
        }
    }

    return values;
}

// The x values (same for all series)
let xValues = d3.range(m);
// The y values of each of the series. Stores n independent bump curves.
let yValuesOfAllSeries = d3.range(n).map(() => bumps(m));

// build an array of arrays (for each series) of the format:
// start y value (y0), end y value (y1), series number
let stackedYValues = d3.stack()
    .keys(d3.range(n)) // the generator (sort according to the index)
        (d3.transpose(yValuesOfAllSeries)) // calling the generator
        // add the index within the series
        .map((data, i) => data.map(([y0, y1]) => [y0, y1, i])); 

// the highest value in grouped form, the highest individual y value
let yGroupedMax = d3.max(yValuesOfAllSeries, y => d3.max(y));  
// the highest y value reached when stacked 
let yStackedMax = d3.max(stackedYValues, y => d3.max(y, d => d[1])); 

// Scales
// x axis
let x = d3.scaleBand()
    .domain(xValues) // according to the length of each series individually, not in total
    .rangeRound([dim.margin, dim.width - dim.margin]);

// y axis
let y = d3.scaleLinear()
    .domain([0, yStackedMax])
    .range([dim.height - dim.margin, dim.margin]);

// coloring of series
let seriesColorGen = d3.scaleSequential(d3.interpolateBlues) 
    .domain([-0.5 * n, 1.5 * n]);

// Chart container
let svg = d3.select('#chart1')
    .append('svg')
    .attrs(dim);

// create the x Axis    
let xAxis = svg.append('g')
        .attr('transform', `translate(0, ${dim.height - dim.margin})`)
        .call(d3.axisBottom(x).tickSize(0).tickSizeOuter(0).tickFormat(() => ""));
      
// Create the bars        
const rect = svg.selectAll('.rect')
    .data(stackedYValues) // each piece of data describes a series
    .join('g')
    .classed('rect', true)
    .attr('fill', (d, i) => seriesColorGen(i))
    .selectAll('rect')
    .data(d => d) // each piece of data is the start, end and index of a bar
    .join('rect')
    .attrs({
        // the rectangles are only created so that they can be manipulated
        // at this stage they will not be displayed
        'x': (d, i) => (x(i)),
        'y': (dim.height - dim.margin),
        'width': x.bandwidth(),
        'height': 0
    });
    

// Transition the graph to the grouped form
function transitionGrouped() {
    y.domain([0, yGroupedMax]); // up to the maximum individual value

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)// the animation will move from left to right
                                          // d[2] is the index within the series
            .attr('x', (d, i) => x(i) + (x.bandwidth() / n) * d[2]) 
            .attr('width', x.bandwidth() / n)
        .transition()  // separate the animations
            .attr('y', d => y(d[1] - d[0]))
            .attr('height', d => y(d[0]) - y(d[1]));
    
}

// Transition the graph to the stacked form
function transitionStacked() {
    y.domain([0, yStackedMax]); // up to the maximum height when stacked

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20) // pan the transition from left to right
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
        .transition() // separate the animations
            .attr('x', (d, i) => x(i))
            .attr('width', x.bandwidth());
}

// Allow to change between the layouts according to the value passed
function layout(layout) {
    if (layout == 'stacked')
        transitionStacked();
    else if (layout == 'grouped')
        transitionGrouped();
}

// The starting position is stacked
layout('stacked');