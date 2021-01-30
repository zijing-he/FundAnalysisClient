
<template>
  <svg id="mainsvg" width="1018" height="120"></svg>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MarketAnalysisCurveChart",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      data: [
        ["20190110", 224, 100, 0.1],
        ["20190111", 528, 150, 0.12],
        ["20190114", 756, 200, 0.14],
        ["20190322", 632, 250, 0.15],
        ["20190331", 582, 180, 0.13],
        ["20190423", 704, 190, 0.138],
        ["20190509", 766, 250, 0.16],
        ["20190515", 804, 300, 0.165],
        ["20190604", 960, 350, 0.168],
        ["20190610", 1095, 380, 0.174],
        ["20191230", 1250, 450, 0.18],
      ],
      idleTimeout : null,
    };
  },

  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  methods: {
    renderInit() {
      let width = d3.select("#mainsvg").attr("width");
      let height = d3.select("#mainsvg").attr("height");
      this.svg = d3.select("#mainsvg").attr("viewBox", [0, 0, width, height]);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // Configuration
      let width = d3.select("#mainsvg").attr("width");
      let height = d3.select("#mainsvg").attr("height");
      let margin = { top: 10, right: 20, bottom: 20, left: 20 };
      let innerWidth = width - margin.left - margin.right;
      let innerHeight = height - margin.top - margin.bottom;
      let g = this.svg
        .append("g")
        .attr("id", "maingroup")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      let xScale = d3
        .scaleBand()
        .domain(this.data.map((d) => d[0]))
        .range([0, innerWidth]);

      let xAxis = g //append是maingroup的函数
        .append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(0,${innerHeight})`);

      let yScaleSize = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[1]))
        .range([innerHeight, 0])
        .nice();

      let yScaleNumber = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[2]))
        .range([innerHeight, 0])
        .nice();

      let yScaleAverageIncome = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[3]))
        .range([innerHeight, 0])
        .nice();

      // let yAxis = d3.axisLeft(yScaleSize);
      // let yGroup = g.append("g").call(yAxis);


      
      let brush = d3.brushX()
      .extent([[0,-margin.top],[innerWidth, innerHeight]])
      .on("end",updateChart);

      let linePathSize = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d) => xScale(d[0]) + 51.8513513514)
        .y((d) => yScaleSize(d[1]));

      let linePathNumber = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d) => xScale(d[0]) + 51.8513513514)
        .y((d) => yScaleNumber(d[2]));

      let linePathAverageIncome = d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d) => xScale(d[0]) + 51.8513513514)
        .y((d) => yScaleAverageIncome(d[3]));

      
      //曲线绘制
      let curveChart = g.append("g");

      curveChart.append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", linePathSize(this.data))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#BBE6E9");

      curveChart.append("g")
        .append("path")
        .attr("class", "line-path-number")
        .attr("d", linePathNumber(this.data))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#FFD9DF");

      curveChart.append("g")
        .append("path")
        .attr("class", "line-path-average-income")
        .attr("d", linePathAverageIncome(this.data))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#CEBDED");

      curveChart.append("g").attr("class","brush").call(brush);

      d3.selectAll(".tick text").attr("font-size", "1em");

      
      function updateChart({selection}){
        console.log(selection);  //打印选中的像素点
      }


      // g.append("g")
      //   .selectAll("circle")
      //   .data(this.data) //绑定基金id
      //   .join("circle")
      //   .attr("cx", d => xScale(d[0]) + 51.8513513514)
      //   .attr("cy", d => yScaleSize(d[1]))
      //   .attr("r", 2)
      //   .style("fill", "green");
    },
    
  },
};
</script>

<style scoped>
</style>