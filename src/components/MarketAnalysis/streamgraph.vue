
<template>
  <div id="market_streamgraph"></div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/market_sector.json";
export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 30, right: 115, bottom: 5, left: 0 },
      width: 993,
      height: 75.2,
      date: Object.keys(dataJSON),
      keys: [],
      data: dataJSON,
    };
  },

  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  computed: {
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.date))
        .range([0, this.innerWidth]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([
          0,
          d3.max(Object.values(this.data), (d) => d3.max(Object.values(d))),
        ])
        .range([this.innerHeight, 0]);
    },
    area() {
      return d3
        .area()
        .x((d, index) => this.xScale(this.date[index]))
        .y0((d) => this.yScale(d[0])*0.2)
        .y1((d) => this.yScale(d[1])*0.2);
    },
    stackedData() {
      return d3.stack().offset(d3.stackOffsetSilhouette).keys(this.keys)(
        Object.values(this.data)
      );
    },
  },
  methods: {
    renderInit() {
      this.keys = Object.keys(dataJSON[this.date[0]]);
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
      // Add X axis
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.innerHeight * 0.8})`)
        .call(
          d3
            .axisBottom(this.xScale)
            .tickSize(-this.innerHeight * 0.7)
            .tickValues([200003, 200502, 201001, 201501, 201901]) //只显示这几个时间点
        )
        .select(".domain")
        .remove();
      // Customization
      this.svg.selectAll(".tick line").attr("stroke", "#b8b8b8");
      // Add X axis label:
      // this.svg
      //   .append("text")
      //   .attr("text-anchor", "end")
      //   .attr("x", this.innerWidth)
      //   .attr("y", this.innerHeight)
      //   .text("Time (year)");
      // color palette
      let color = d3
        .scaleOrdinal()
        .domain(this.keys)
        .range([...d3.schemeCategory10,...d3.schemePaired,...d3.schemeSet1]);
      // create a tooltip
      // let Tooltip = this.svg
      //   .append("text")
      //   .attr("x", 5)
      //   .attr("y", 10)
      //   .style("opacity", 0)
      //   .style("font-size", 14);
      // Three function that change the tooltip when user hover / move / leave a cell
      // var mouseenter = function (d, i) {
      //   Tooltip.text(i.key);
      //   Tooltip.style("opacity", 1).style("fill", color(i.key));
      //   d3.selectAll(".streamGraph").style("opacity", 0.2);
      //   d3.select(this).style("stroke", "black").style("opacity", 1);
      // };
      // var mouseleave = function (d) {
      //   Tooltip.style("opacity", 0);
      //   d3.selectAll(".streamGraph")
      //     .style("opacity", 1)
      //     .style("stroke", "none");
      // };
      // Show the areas
      this.svg
        .selectAll("streamGraphLayers")
        .data(this.stackedData)
        .enter()
        .append("path")
        .attr("class", "streamGraph")
        .style("fill", (d) => color(d.key))
        .attr("d", this.area);
      //   .on("mouseenter", mouseenter)
      //   .on("mouseleave", mouseleave);
    },
  },
};
</script>

<style scoped>
#market_streamgraph {
  height: 75.2px;
  width: 100%;
}
</style>