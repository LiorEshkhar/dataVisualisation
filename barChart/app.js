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

    // Determine color according to value (defining a function here)
    let color = d3.scaleSequential()
        .domain([0, d3.max(selectedData, d => d.value)])
        .interpolator(d3.interpolateRgb("#D9F9A5", "#1B98E0"));

    // Axis
    chart.select('#axis')
        .transition()
        // Add an axis according to the information stored in x (domain, location)
        .call(d3.axisBottom(x).tickSizeOuter(0)) // bottom - labels are below the axis
        .attr('color', '#666666')
        // move the axis 0 in the x direction and height in the y direction
        .attr('transform', `translate(0, ${CHART_HEIGHT})`);

    // Update the bars
    chart.selectAll('.bar')     // select all elements of class .bar (none yet)
        .data(selectedData, data => data.id)       // bind the data
        .join(enter => enter
            .append('rect')
            .classed('bar', true)   // set these rects to be of class bar
            .attr('width', x.bandwidth())   // set the rects to be of uniform width
            .attr('height', 0)
            .attr('y', CHART_HEIGHT)
            .attr('x', data => x(data.region))      // set the x coordinate
            .transition().duration(600)             // add an animation
            //linearly set the height
            .attr('y', data => y(data.value))       // set the y coordinate
            .attr('height', data => CHART_HEIGHT - y(data.value)),

            update => update
            .transition().duration(600)             // add an animation
            .attr('x', data => x(data.region))      // set the x coordinate
            .attr('width', x.bandwidth()),   // set the rects to be of uniform width

            exit => exit
            .transition().duration(300)
            //linearly set the height
            .attr('y', CHART_HEIGHT)
            .attr('width', 0)
            .attr('transform', `translate(${x.bandwidth()/2}, 0)`)
            .attr('height', 0)
            .remove()
            )
        .attr('fill', data => color(data.value))


    // Update the labels
    chart.selectAll('.label')       // Select all labels (none yet)
        .data(selectedData, data => data.id)           // bind the data
        .join('text')             // remove and append the needed labels
        .text(data => data.value)   // set the text to be the value of each one
        // set them to be in the middle of each bar
        .attr('x', data => x(data.region) + x.bandwidth() / 2)
        .attr('y', CHART_HEIGHT - CHART_HEIGHT * 0.1)
        .attr('text-anchor', 'middle') // the position of text will be decided by its middle
        .classed('label', true)        // add them to class label
        .attr('opacity', -5)            // labels initially invisible (negative so that they appear later)
        .attr('fill', data => color(data.value))
        .transition().duration(800)
        .attr('y', data => y(data.value) - CHART_HEIGHT * 0.05) // set them to be above each bar
        .attr('opacity', 1);           // turn labels to visible 
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