
<template>
  <div id="market_streamgraph"></div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/market_sector_new.json";
export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 54, right: 125, bottom: 35, left: 30 },
      width: 1261.98,
      height: 100,
      new_date: Object.keys(dataJSON),
      keys: [],
      data: dataJSON,
    };
  },

  mounted: function () {
    // console.log(this.data);
    // for(let year in this.data){
    //   let sum = 0;
    //   for(let sector in this.data[year]){
    //     // console.log(year,sector);
    //     sum += this.data[year][sector];
    //   }
    //   console.log(year,sum);
    // }
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
        .scaleTime()
        .domain([this.new_date[0], this.new_date[this.new_date.length - 1]])
        .range([0, this.innerWidth])
        .nice();
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
        .x((d, index) => this.xScale(this.new_date[index]))
        .y0((d) => this.yScale(d[0]))
        .y1((d) => this.yScale(d[1]));
    },
    stackedData() {
      return d3.stack().offset(d3.stackOffsetSilhouette).keys(this.keys)(
        Object.values(this.data)
      );
    },
  },
  methods: {
    renderInit() {
      this.keys = Object.keys(dataJSON[this.new_date[0]]);
      this.new_date = this.new_date.map(
        (d) => new Date(d.substring(0, 4) + "-" + d.substring(4))
      );
      this.svg = d3
        .select("#market_streamgraph")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        // .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      // Add X axis
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(
          d3
            .axisBottom(this.xScale)
            .ticks(d3.timeYear.every(1))
            .tickValues([])
          // .tickSize(this.innerHeight+10)
        )
        .select(".domain")
        .remove();
      // Customization
      this.svg.selectAll(".tick line").attr("stroke", "black");
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
        .range([...d3.schemeCategory10, ...d3.schemePaired, ...d3.schemeSet1]);
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
        .style("fill", "black")
        .attr("d", this.area);
      //   .on("mouseenter", mouseenter)
      //   .on("mouseleave", mouseleave);

      // this.svg
      //   .selectAll(".colorLegend")
      //   .data(this.keys)
      //   .enter()
      //   .append("rect")
      //   .attr("x", this.innerWidth + 20)
      //   .attr("y", (d, i) => -25 + i * 10)
      //   .attr("width", 5)
      //   .attr("height", 5)
      //   .attr("fill", (d) => color(d));

      // this.svg
      //   .selectAll(".textLegend")
      //   .data(this.keys)
      //   .enter()
      //   .append("text")
      //   .attr("x", this.innerWidth + 30)
      //   .attr("y", (d, i) => -22 + i * 10)
      //   .text((d) => d)
      //   .style("font-size", 8)
      //   .attr("text-anchor", "left")
      //   .style("alignment-baseline", "middle");
      // this.svg.selectAll(".tick text").attr("transform", "translate(0,15)");
    },
  },
};
</script>

<style scoped>
#market_streamgraph {
  margin-top: 10px;
  height: 110px;
  width: 100%;
}
</style>