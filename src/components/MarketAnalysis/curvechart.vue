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
      margin: { top: 10, right: 30, bottom: 20, left: 30 },
      width: 993,
      height: 75.2,
      date: Object.keys(dataJSON["fund_size"]),
      fund_size: Object.values(dataJSON["fund_size"]),
      fund_number: Object.values(dataJSON["fund_number"]),
      fund_return: Object.values(dataJSON["fund_return"]),
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
        .scaleBand()
        .domain(this.date)
        .range([0, this.innerWidth])
        .paddingInner(1);
    },
    yScale() {
      return d3.scaleLinear().range([this.innerHeight, 0]).nice();
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(this.date[i])) 
        .y((d) => this.yScale(d));
    },
  },

  methods: {
    renderInit() {
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
        .call(
          d3
            .axisBottom(this.xScale)
            .tickSize(10)
            .tickValues([
              200001,
              200501,
              200901,
              201001,
              201501,
              201901,
              201912,
            ])
        )
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
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", this.linePath(this.fund_size))
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#BBE6E9");

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

      // fund_return——紫色
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
    },
  },
};
</script>

<style scoped>

</style>