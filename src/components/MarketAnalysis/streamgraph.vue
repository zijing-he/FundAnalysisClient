
<template>
  <div id="market_streamgraph"></div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/StreamGraph/market_date_sector.json";
import sectorJSON from "@/data/StreamGraph/market_sector_date.json";
export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 0, right: 125, bottom: 35, left: 30 },
      width: 1261.98,
      height: 100,
      date: Object.keys(dataJSON),
      keys: [],
      data: dataJSON,
      sector_data: sectorJSON,
      data_sum: [],
      sectors: ["食品饮料", "医疗生物", "国防军工", "汽车", "计算机"],
      min: 0,
    };
  },

  mounted: function () {
    // console.log(dataJSON);
    // console.log(sectorJSON);
    // console.log(this.sector_data["医药生物"]);
    // console.log(d3.extent(Object.values(this.sector_data["医药生物"])));
    
    this.renderInit();
    console.log(this.min);
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
        .domain([this.date[0], this.date[this.date.length - 1]])
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.data_sum),
          // d3.max(Object.values(this.data), (d) => d3.max(Object.values(d))),
        ])
        .range([this.innerHeight, 0]);
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(this.date[i]))
        .y((d) => this.yScale(d));
    },
    area() {
      return d3
        .area()
        .x((d, i) => this.xScale(this.date[i]))
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
      this.keys = Object.keys(this.data[this.date[0]]);
      this.date = this.date.map(
        (d) =>
          new Date(
            d.substring(0, 4) + "-" + d.substring(4, 6) + "-" + d.substring(6)
          )
      );
      //求每个季度各行业总和
      for (let date in this.data) {
        let sum = 0;
        for (let sector in this.data[date]) {
          sum += this.data[date][sector];
        }
        this.data_sum.push(sum);
      }

      this.min = d3.min(Object.values(this.sector_data["医药生物"]));
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
            .tickSize(this.innerHeight / 3)
        );
      // .select(".domain")
      // .remove();
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
      let color = d3
        .scaleOrdinal()
        .domain(this.keys)
        .range([...d3.schemeCategory10, ...d3.schemePaired, ...d3.schemeSet1]);

      let streamGraph = this.svg.append("g");

      streamGraph
        .selectAll(".streamGraphLayers")
        .data(this.stackedData)
        .enter()
        .append("path")
        .attr("class", "streamGraphLayers")
        // .style("fill", (d) => color(d.key))
        .style("fill", "#9F9D9D")
        .attr("d", this.area);
      //   .on("mouseenter", mouseenter)
      //   .on("mouseleave", mouseleave);

      let sectorChart = this.svg.append("g");

      this.yScale.domain(
        d3.extent(Object.values(this.sector_data["医药生物"]))
      );
      sectorChart
        .append("g")
        .append("path")
        .attr("class", "line-path-yiyao")
        .attr("d", this.linePath(Object.values(this.sector_data["医药生物"])))
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#928a97");
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