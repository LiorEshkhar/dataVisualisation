const DUMMY_DATA = [
    { id: 'd1', value: 2, region: 'USA' },
    { id: 'd2', value: 11, region: 'ISRAEL' },
    { id: 'd3', value: 6, region: 'CYPRUS' },
    { id: 'd4', value: 8, region: 'GERMANY' }
];

// Chart dimensions
const MARGINS = {top: 20, bottom: 10};
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

// Functions to set width and height
const x = d3.scaleBand()          // scale uniformly
    .rangeRound([0, CHART_WIDTH]) // set the range and round the values 
    .padding(0.1);                // set the padding to 10%
const y = d3.scaleLinear()        // scale linearly to the values
.range([CHART_HEIGHT, 0]);        // set the range and keep the exact values

// set the domain to be the regions, meaning the values will be attached to the regions
x.domain(DUMMY_DATA.map(d => d.region)); 
// set the domain to be a bit more than the full range of value
y.domain([0, d3.max(DUMMY_DATA, d => d.value) + 3]);

// select the svg and set its size
const chartContainer = d3
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);


const chart = chartContainer.append('g'); // append g, an element used to group

// Axis
chart.append('g').call(d3.axisBottom(x).tickSizeOuter(0))
.attr('color', '#666666')
.attr('transform', `translate(0, 3)`)
.attr('transform', `translate(0, ${CHART_HEIGHT})`);

// Add the bars
chart.selectAll('.bar')     // select all elements of class .bar (none yet)
    .data(DUMMY_DATA)       // bind the data
    .enter()                // select the missing elements
    .append('rect')         // create a rect for each missing element
    .classed('bar', true)   // set these rects to be of class bar
    .attr('width', x.bandwidth())   // set the rects to be of uniform width
    .attr('height', data => CHART_HEIGHT - y(data.value)) // linearly set the height
    .attr('x', data => x(data.region))      // set the x coordinate
    .attr('y', data => y(data.value));      // set the y coordinate

// Add the labels
chart.selectAll('.label')       // Select all labels (none yet)
    .data(DUMMY_DATA)           // bind the data
    .enter()                    // select the missing elements
    .append('text')             // append the text element, not the word text
    .text(data => data.value)   // set the text to be the value of each one
    // set them to be in the middle of each bar
    .attr('x', data => x(data.region) + x.bandwidth() / 2)  
    .attr('y', data => y(data.value) - 20) // set them to be above each bar
    .attr('text-anchor', 'middle') // the position of text will be decided by its middle
    .classed('label', true)        // add them to class label

