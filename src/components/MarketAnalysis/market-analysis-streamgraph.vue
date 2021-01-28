
<template>
  <div id="market_streamgraph"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 20, right: 40, bottom: 30, left: 40 },
      width: 1359,
      height: 160,
      data: [],
    };
  },

  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  methods: {
    renderInit() {
      this.svg = d3
        .select("#market_streamgraph")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // Configuration
      let innerWidth = this.width - this.margin.left - this.margin.right;
      let innerHeight = this.height - this.margin.top - this.margin.bottom;

      var keys = this.data.columns.slice(1);

      // Add X axis
      let xScale = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d.year))
        .range([0, innerWidth]);

      svg
        .append("g")
        .attr("transform", `translate(0,${innerHeight * 0.8})`)
        .call(
          d3
            .axisBottom(x)
            .tickSize(-height * 0.7)
            .tickValues([1900, 1925, 1975, 2000])
        )
        .select(".domain")
        .remove();

      // Customization
      this.svg.selectAll(".tick line").attr("stroke", "#b8b8b8");

      // Add X axis label:
      this.svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", innerWidth)
        .attr("y", innerHeight - 30)
        .text("Time (year)");

      // Add Y axis
      let yScale = d3
        .scaleLinear()
        .domain([-100000, 100000])
        .range([height, 0]);

      // color palette
      let color = d3.scaleOrdinal().domain(keys).range(d3.schemeDark2);

      //stack the data?
      let stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
        this.data
      );

      // create a tooltip
      let Tooltip = this.svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0)
        .style("font-size", 17);
      // Three function that change the tooltip when user hover / move / leave a cell
      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        Tooltip.style("opacity", 1);
        d3.selectAll(".streamGraph").style("opacity", 0.2);
        d3.select(this).style("stroke", "black").style("opacity", 1);
      };
      var mousemove = function (d, i) {
        let name = keys[i];
        Tooltip.text(name);
      };
      var mouseleave = function (d) {
        Tooltip.style("opacity", 0);
        d3.selectAll(".streamGraph")
          .style("opacity", 1)
          .style("stroke", "none");
      };

      // Area generator
      let area = d3
        .area()
        .x((d) => xScale(d.data.year))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]));

      // Show the areas
      this.svg
        .selectAll("streamGraphLayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "streamGraph")
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    },
  },
};
</script>

<style scoped>
</style>