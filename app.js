const DUMMY_DATA = [
    { id: 'd1', value: 5, region: 'USA' },
    { id: 'd2', value: 11, region: 'ISRAEL' },
    { id: 'd3', value: 7, region: 'CYPRUS' },
    { id: 'd4', value: 3, region: 'GERMANY' }
];

d3.select('div')
    .selectAll('p')
    .data(DUMMY_DATA)
    .enter()
    .append('p')
    .text(dta => dta.region);