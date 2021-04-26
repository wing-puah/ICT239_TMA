function drawChart(data) {
  const jsonifyData = data.map((el) => JSON.parse(el));
  // Setting dimension
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // append svg
  const svg = drawChartContainer();
}

function drawChartContainer() {
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`);
  return svg;
}
