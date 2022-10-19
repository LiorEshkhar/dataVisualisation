const DUMMY_DATA = [
    { id: 'd1', value: 5, region: 'USA' },
    { id: 'd2', value: 11, region: 'ISRAEL' },
    { id: 'd3', value: 7, region: 'CYPRUS' },
    { id: 'd4', value: 3, region: 'GERMANY' }
];

const container = d3.select('div')
    .classed('container', true)
    .style('border', '2px solid red');

const bars = container
    .selectAll('.bar')    // Selecting all the bar elements
    .data(DUMMY_DATA)     // Bind data
    .enter()              // Find what data was not rendered yet
    .append('div')        // Add a div for every non rendered data point
    .classed('bar', true) // Define all the created divs to .bar, matching the selection
    .style('width', '50px')
    .style('height', data => (data.value * 15) + 'px');