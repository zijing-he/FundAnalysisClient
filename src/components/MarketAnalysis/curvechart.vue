<template>
  <div id="market_curvechart"></div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/market_data.json";

export default {
  name: "MarketAnalysisCurveChart",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 125, bottom: 20, left: 30 },
      width: 1261.98,
      height: 100,
      date: Object.keys(dataJSON["fund_size"]),
      fund_size: Object.values(dataJSON["fund_size"]),
      fund_number: Object.values(dataJSON["fund_number"]),
      fund_return: Object.values(dataJSON["fund_return"]),
      keys: ["基金规模", "基金数量", "基金平均收益"],
    };
  },

  mounted: function () {
    console.log(dataJSON["fund_size"]);
    console.log(d3.extent(this.fund_size));

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
        .domain([this.date[0], this.date[this.date.length - 1]])
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3.scaleLinear().range([this.innerHeight, 0]);
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(this.date[i]))
        .y((d) => this.yScale(d));
    },
    colorScale() {
      return d3
        .scaleOrdinal()
        .domain(this.keys)
        .range(["#BBE6E9", "#FFD9DF", "#CEBDED"]);
    },
  },

  methods: {
    renderInit() {
      this.date = this.date.map(
        (d) => new Date(d.substring(0, 4) + "-" + d.substring(4))
      );
      this.svg = d3
        .select("#market_curvechart")
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
        .call(d3.axisBottom(this.xScale).ticks(d3.timeYear.every(1), "%Y"))
        .attr("transform", `translate(0,${this.innerHeight})`);

      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", updateChart);

      let curveChart = this.svg.append("g");

      //fund_size 蓝色
      this.yScale.domain(d3.extent(this.fund_size));
      // console.log(this.yScale(0),this.yScale(100000));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", this.linePath(this.fund_size))
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#BBE6E9");

      // curveChart
      //   .selectAll(".points")
      //   .data(this.fund_size)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", (d, i) => this.xScale(this.date[i]))
      //   .attr("cy", (d) => this.yScale(d))
      //   .attr("r", 1)
      //   .attr("fill", "red");

      // fund_number 橙黄
      this.yScale.domain(d3.extent(this.fund_number));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-number")
        .attr("d", this.linePath(this.fund_number))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#FFD9DF");

      // // fund_return——紫色
      this.yScale.domain(d3.extent(this.fund_return));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#CEBDED");

      curveChart.append("g").attr("class", "brush").call(brush);

      function updateChart({ selection }) {
        console.log(selection); //打印选中的像素点
      }

      //legend
      this.svg
        .selectAll(".legend")
        .data(this.keys)
        .enter()
        .append("circle")
        .attr("cx", this.innerWidth + 15)
        .attr("cy", (d, i) => 5 + i * 18)
        .attr("r", 3)
        .style("fill", (d) => this.colorScale(d));
      this.svg
        .selectAll(".labels")
        .data(this.keys)
        .enter()
        .append("text")
        .attr("x", this.innerWidth + 25)
        .attr("y", (d, i) => 5 + i * 18)
        .style("fill", (d) => this.colorScale(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    },
  },
};
</script>

<style scoped>
#market_curvechart {
  height: 110px;
  width: 100%;
}
</style>