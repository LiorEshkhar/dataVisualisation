let sample;
let data = [];

// declaring the functions so that they can be accessed by buttons,
// allowing the user to scroll through the graph
function next() { }
function previous() { }

// Chart dimensions
let dim = {
    'width': window.innerWidth * 0.7,
    'height': window.innerHeight * 0.8,
    'margin': window.innerHeight * 0.15
}

// Craete the chart
let svg = d3.select('#chart1')
    .append('svg')
    .attrs(dim);
// container for the graph (path) itself
let g = svg.append('g');

// convert the array read from the csv file to an array of objects
function convToArray(sample) {
    sample.forEach(element => {
        data.push({
            date: d3.timeParse("%Y-%m-%d")(element[0]),
            price: parseFloat(element[1]) // convert string to float
        })
    })
}

// async/await because the rest can only run once the data is rendered
// fetch is asynchon by default, meaning the rest of the code dods not wait for it to finish
async function renderData() {
    const resp = await fetch('./data.csv');
    sample = await resp.text();
    // csv.toArrays converts each line to an array
    // slice(1) removes the headers
    sample = await $.csv.toArrays(sample).slice(1);
    convToArray(sample);
}

// asynb function used to make sure the data is rendered before the rest is executed
(async function () {
    await renderData();

    // function to generate x axis
    let scaleX = d3.scaleTime()
        .nice()
        .range([dim.margin, dim.width - dim.margin]);

    // create the x axis
    let axisX = svg.append('g')
        .attr('transform', `translate(0, ${dim.height - dim.margin})`)
        .attr('color', '#2b2d42');



    // function to generate y axis
    let scaleY = d3.scaleLinear()
        .nice()
        // +2 due to compensate for the width of the x axis and align the axes
        .range([dim.height - dim.margin + 2, dim.margin]);

    // create the y axis
    let axisY = svg.append('g')
        .attr('transform', `translate(${dim.margin}, 0)`)
        .attr('color', '#2b2d42');

    // line generator
    let line = d3.line()
        .x(d => scaleX(d.date))     // how x values should be calculated
        .y(d => scaleY(d.price));   // how y values should be calculated

    // area generator
    let area = d3.area()
        .x(d => scaleX(d.date))
        .y0(d => scaleY(0))
        .y1(d => scaleY(d.price));

    // the duration each section will be viewed for
    let cycle = 1500;

    // define the section of the data to be viewed
    let intervalEnd = 150;
    let intervalIncrement = 150;

    // view the next section
    next = function () {
        intervalEnd += intervalIncrement;

        // if at the end
        if (intervalEnd >= data.length)
            // disable the "next" button
            document.getElementById('nextBtn').disabled = true;
        document.getElementById('previousBtn').disabled = false;

        sendDraw();
    }

    // view the previous section
    previous = function () {
        intervalEnd -= intervalIncrement;

        // if at the beginning
        if (intervalEnd <= intervalIncrement)
            // disable the "previous" button
            document.getElementById('previousBtn').disabled = true;
        document.getElementById('nextBtn').disabled = false;

        sendDraw();
    }

    // automatically run through the sections
    let recurringDraw = setInterval(next, cycle);

    // send the current section of data to draw
    function sendDraw() {
        // if at the end, stop the automatic loop
        if (intervalEnd > data.length)
            clearInterval(recurringDraw);

        draw(data.slice(Math.max(intervalEnd - intervalIncrement, 0), intervalEnd));
    }

    // draw and update the graph
    function draw(data) {
        let t = d3.transition().duration(500)

        // update the domain of the generator for the x axis
        scaleX.domain(d3.extent(data, d => d.date))

        // update the x axis
        axisX.transition(t)
            .call(d3.axisBottom(scaleX)
                .tickFormat(d3.timeFormat("%m-%Y"))
                .tickSize(10)
                .tickSizeOuter(0)
                .ticks(8))
            .selectAll('text');

        // style the x axis
        styleAxis(axisX);

        // update the domain of the generator for the y axis
        scaleY
            .domain([0, d3.max(data, d => d.price)])

        // update the y axis
        axisY.transition(t)
            .call(d3.axisLeft(scaleY)
                .ticks(5)
                .tickSizeOuter(0))

        // style the y axis
        styleAxis(axisY);

        // update the graph
        g.selectAll('path')
            // putting data inside of an array so that there is one peace of data
            // and the graph is drawn once, otherwise the graph would be drawn once
            // for each element in the array
            .data([data], d => d[0].date)

            // draw the new path
            .join(enter => enter
                .append('path')
                .attrs({
                    'fill': 'none',
                    'stroke': '#8d99ae',
                    'stroke-width': '2px',
                    'd': line(data)         // generator
                }),

                update => update,

                // remove the old path
                exit => exit
                    .transition().duration(1000)
                    .attr('d', line(data))
                    .remove())
    }

    // style the axes
    function styleAxis(axis) {
        // the line
        axis.selectAll('.domain')
            .attrs({
                'stroke': '#E04836',
                'stroke-width': 6
            });
        // the labels
        axis.selectAll('text')
            .attrs({
                'font-size': '1rem',
                'color': '#381501'
            })

        // the ticks
        axis.selectAll('line')
            .attrs({
                'stroke': '#E04836',
                'stroke-width': 3,
                'opacity': .8
            });
    }
})();

