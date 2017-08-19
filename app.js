/*
FCC – D3.js Bar Chart
User Story: I can see US Gross Domestic Product by quarter, over time.
User Story: I can mouse over a bar and see a tooltip with the GDP amount and exact year and month that bar represents.
*/

var margin = {top: 20, right: 30, bottom: 30, left: 40, topOffset: 100, rightOffset: 50},
width = document.documentElement.clientWidth - margin.left - margin.right - margin.rightOffset,
height = document.documentElement.clientHeight - margin.top - margin.bottom - margin.topOffset;

//var x = d3.scale.ordinal()
//    .rangeRoundBands([0, width]);

var x = d3.time.scale()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(d3.time.years,5);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var chart = d3.select(".chart")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function fetchRecent() {
var gdpData = [];
fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(function(response) {
   return response.json();
 })
.then(function(json) {
   var data = json.data;
   var barWidth = Math.ceil(width / data.length);
   var startDate = new Date(data[0][0]);
   var endDate = new Date(data[data.length-1][0]);
   x.domain([startDate, endDate]);
   //x.domain(data.map(function(d) { return d[0]; }));
   y.domain([0, d3.max(data, function(array) {return d3.max(array.slice(1));})]);

   chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

   chart.append("g")
     .attr("class", "y axis")
     .call(yAxis);

   chart.selectAll(".bar")
     .data(data)
     .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(new Date(d[0])); })
       .attr("y", function(d) { return y(d[1]); })
       .attr("height", function(d) { return height - y(d[1]); })
       .attr("width", barWidth)
         .on('mouseover', function (data, i)  {
        d3.select(this).attr("class", "mouseover");
          })
         .on('mouseout', function (data, i)  {
        d3.select(this).attr("class", "mouseout");
          });
}); 

function type(d) {
  d[1] = +d[1]; // coerce to number
  return d;
}

}

fetchRecent();
