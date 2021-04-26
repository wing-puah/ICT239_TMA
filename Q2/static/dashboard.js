/**
 * @see https://www.d3-graph-gallery.com/graph/line_basic.html
 */

function drawChart(data) {
  const jsonifyData = data.map((el) => {
    const _el = JSON.parse(el);
    const dateTimeString = `${_el.date} ${_el.time}`.replace(/-/g, "/");
    _el.dateTime = new Date(dateTimeString);
    return _el;
  });

  // Setting dimension
  const margin = { top: 10, right: 0, bottom: 30, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  // append svg
  const chart = new Chart({ margin, width, height, data: jsonifyData });
  chart.drawContainer().drawXScale().drawYScale().plot();
}

class Chart {
  constructor({ margin, width, height, data }) {
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.data = data;
    this.svg = null;
    this.xScale = null;
    this.yScale = null;
  }

  drawContainer() {
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.right})`
      );

    this.svg = svg;
    return this;
  }

  drawXScale() {
    const xScale = d3
      .scaleTime()
      // d3 requires date object to work
      .domain(d3.extent(this.data, (d) => d.dateTime))
      .range([0, this.width]);

    this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(d3.axisBottom(xScale));

    this.xScale = xScale;
    return this;
  }

  drawYScale() {
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => +d.total_calories)])
      .range([this.height, 0]);

    this.svg.append("g").call(d3.axisLeft(yScale));

    this.yScale = yScale;
    return this;
  }

  plot() {
    const { xScale, yScale, data } = this;

    this.svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d.dateTime))
          .y((d) => yScale(+d.total_calories))
      );
  }
}
