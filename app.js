const DUMMY_DATA = [
    { id: 'd1', value: 2, region: 'USA' },
    { id: 'd2', value: 11, region: 'ISRAEL' },
    { id: 'd3', value: 6, region: 'CYPRUS' },
    { id: 'd4', value: 8, region: 'GERMANY' },
    { id: 'd5', value: 3.60, region: 'UK' }
];

// Chart dimensions
const MARGINS = { top: 20, bottom: 10 };
const CHART_WIDTH = window.innerWidth * 0.5;
const CHART_HEIGHT = window.innerHeight * 0.8 - MARGINS.top - MARGINS.bottom;

let selectedData = DUMMY_DATA;

// select the svg and set its size
const chartContainer = d3
.select('svg')
.attr('width', CHART_WIDTH)
.attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

// Functions to set width and height
const x = d3.scaleBand()          // scale uniformly
    .rangeRound([0, CHART_WIDTH]) // set the range and round the values 
    .padding(0.1);                // set the padding to 10%
const y = d3.scaleLinear()        // scale linearly to the values
    .range([CHART_HEIGHT, 0]);        // set the range and keep the exact values

const chart = chartContainer.select('g'); // a svg element used to group elements

function renderChart() {

    // set the domain to be the regions, meaning the values will be attached to the regions
    x.domain(selectedData.map(d => d.region));
    // set the domain to be a bit more than the full range of value
    y.domain([0, d3.max(selectedData, d => d.value) + 3]);

    // Axis
    chart.select('#labels')
        // Add an axis according to the information stored in x (domain, location)
        .call(d3.axisBottom(x).tickSizeOuter(0)) // bottom - labels are below the axis
        .attr('color', '#666666')
        // move the axis 0 in the x direction and height in the y direction
        .attr('transform', `translate(0, ${CHART_HEIGHT})`);

    // Reset the bars
    chart.selectAll('.bar')     // select all bars
        .data([])               // Bind to an empty array
        .exit()                 // select all dedundant - all, since the array is emtpy
        .remove();

    // Reset the lables
    chart.selectAll('.label')
        .data([])
        .exit()
        .remove()

    // Add the bars
    chart.selectAll('.bar')     // select all elements of class .bar (none yet)
        .data(selectedData, data => data.id)       // bind the data
        .enter()                // select the missing elements
        .append('rect')         // create a rect for each missing element
        .classed('bar', true)   // set these rects to be of class bar
        .attr('width', x.bandwidth())   // set the rects to be of uniform width
        .attr('x', data => x(data.region))      // set the x coordinate
        .attr('y', data => y(data.value))       // set the y coordinate
        .transition().duration(600)             // add an animation
        //linearly set the height
        .attr('height', data => CHART_HEIGHT - y(data.value))
        ; 

    // Add the labels
    chart.selectAll('.label')       // Select all labels (none yet)
        .data(selectedData, data => data.id)           // bind the data
        .enter()                    // select the missing elements
        .append('text')             // append the text element, not the word text
        .text(data => data.value)   // set the text to be the value of each one
        // set them to be in the middle of each bar
        .attr('x', data => x(data.region) + x.bandwidth() / 2)
        .attr('y', data => y(data.value) - CHART_HEIGHT * 0.05) // set them to be above each bar
        .attr('text-anchor', 'middle') // the position of text will be decided by its middle
        .classed('label', true)        // add them to class label
}

renderChart();

// Selectors
let unselectedIds = [];

// Add a list with number of elements equal to the number of countries
const listItmes = d3.select('#data')
    .select('ul')
    .selectAll('li')
    .data(DUMMY_DATA)
    .enter()
    .append('li');

// Add the names of the countries
listItmes.append('span')
    .text(data => data.region);

// Add checkboxes and manage the events of them being checked or unchecked
listItmes.append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .on('change', (e, data) => {
        if (unselectedIds.indexOf(data.id) === -1) {
            unselectedIds.push(data.id);
        } else {
            unselectedIds = unselectedIds.filter(id => id !== data.id);
        }
        selectedData = DUMMY_DATA.filter(d => unselectedIds.indexOf(d.id) === -1);
        renderChart();
    });