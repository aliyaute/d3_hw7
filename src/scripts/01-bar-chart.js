import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorSCale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

d3.csv(require('../data/countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */

  /* Buttons outside the */

  /*<a class="btn btn-warning" id='asia'>Asia</a>
  <a class="btn btn-warning" id='africa'>Africa</a>
  <a class="btn btn-warning" id='n-america'>North America</a>
  <a class="btn btn-warning" id='low-gdp'>Low GDP countries</a>
  <a class="btn btn-warning" id='continent'>Color by continent</a>
  <a class="btn btn-warning" id='reset'>Reset</a>*/

  d3.select('#asia').on('click', function() {
    svg
      .selectAll('rect')
      .attr('fill', function(d) {
        if (d.continent == 'asia') {
          return 'blue'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })
  d3.select('#africa').on('click', function() {
    svg
      .selectAll('rect')
      .attr('fill', function(d) {
        if (d.continent == 'Africa') {
          return 'blue'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })
  d3.select('#n-america').on('click', function() {
    svg
      .selectAll('rect')
      .attr('fill', function(d) {
        if (d.continent == 'n-america') {
          return 'blue'
        } else {
          return 'lightgrey'
        }
      })
      .raise()
  })
  d3.select('#low-gdp').on('click', () => {
    svg.selectAll('rect').attr('fill', d => {
      if (d.gdp_per_capita < 3000) {
        return 'blue'
      } else {
        return 'lightgrey'
      }
    })
  })

  d3.select('#continent').on('click', () => {
    svg.selectAll('rect').attr('fill', d => {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

/* actual graph inside */

  svg
  .selectAll('rect')
  .data(datapoints)
  .enter()
  .append('rect')
  .attr('width', xPositionScale.bandwidth())
  .attr('height', d=> {
    return height - yPositionScale(d.life_expectancy)
  })
  .attr('x', d=> {
    return xPositionScale(d.country)
  })
  .attr('y', d => {
    return yPositionScale(d.life_expectancy)
  })
  .attr('fill', d=>colorScale(d.continent))

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
