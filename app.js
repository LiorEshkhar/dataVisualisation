const DUMMY_DATA = [
    { id: 'd1', value: 1, region: 'USA' },
    { id: 'd2', value: 11, region: 'ISRAEL' },
    { id: 'd3', value: 7, region: 'CYPRUS' },
    { id: 'd4', value: 8, region: 'GERMANY' }
];

const xScale = d3.scaleBand()  // uniform scaling
    // setting the different country names as the domain
    .domain(DUMMY_DATA.map(dataPoint => dataPoint.region)) 
    .rangeRound([0, 250])   // setting the possible range of values
    .padding(0.2);
const yScale = d3.scaleLinear() // scale linearaly to some values
                .domain([0, 15]) // set the domain in some units
                .range([0, 200]); // set the corresponding domain in pixels

const container = d3.select('svg')
    .classed('container', true)

const bars = container
    .selectAll('.bar')    // Selecting all the bar elements
    .data(DUMMY_DATA)     // Bind data
    .enter()              // Find what data was not rendered yet
    .append('rect')        // Add a div for every non rendered data point
    .classed('bar', true) // Define all the created divs to .bar, matching the selection
    .attr('width', xScale.bandwidth()) // set the width to be the same for all
    .attr('height', (data) => yScale(data.value))  // set the height to depend on value
    // the location of each country was defined in xScale (as region was the domain )
    .attr('x', data => xScale(data.region))
    .attr('y', data => 200 - yScale(data.value));

setTimeout(() => {
    // Render the bars again only with the first 2 data pieces
    bars.data(DUMMY_DATA.slice(0, 2))  
    .exit()    // Returns the elements that were rendered, but whose data was removed
    .remove()
}, 3000);