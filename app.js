const countryData = {
    items: ['China', 'India', 'USA'],
    addItem(item) {
        this.items.push(item);
    },
    removeItem(index) {
        this.items.splice(index, 1);
    },
    updateItem(index, newItem) {
        this.items[index] = newItem;
    }
};

d3.select('ul')
    .selectAll('li')    // select all li, even if they do not exist yet
    .data(countryData.items)
    .enter()       // returns all missing items
    .append('li')
    .text(data => data); // write each data into its corresponding li

setTimeout(() => {
    countryData.addItem("Germany");
    d3.select('ul')
        .selectAll('li')
        .data(countryData.items)
        .enter()       // returns all missing items
        .append('li')
        .classed('added', true)
        .text(data => data); // write each data into its corresponding li
}, 2000);

setTimeout(() => { // diagram below
    countryData.removeItem(0);
    d3.select('ul')
        .selectAll('li')
        .data(countryData.items, data => data)
        // Return all redundant items - items that were rendered, 
        // but whose index - here name - is not part of the data anymore
        .exit()         
        .classed('redundant', true)
}, 4000);

setTimeout(() => { // diagram below
    countryData.updateItem(1, 'Russia');
    // remove
    d3.select('ul')
        .selectAll('li')
        .data(countryData.items, data => data)
        // Return all redundant items - items that were rendered, 
        // but whose index - here name - is not part of the data anymore
        .exit() 
        .remove()
        
    d3.select('ul')
        .selectAll('li')
        .data(countryData.items, data => data)
        .enter()
        .append('li')
        .text(data => data)
        .classed('updated', true)
}, 6000);


/* 
There are 4 li, who are linked to 4 pieces of data. 
Automatically they are linked to the index of the pieces of data:
li -> 0
li -> 1
li -> 2
li -> 3

When data is removed with the index identified as the name, 
the names are now chosen to identify the different li:
li -> China
li -> India
li -> USA 
li -> Germany

This is compared against the data:
India, USA, Germany

Through which China will be marked as redundant.
*/


