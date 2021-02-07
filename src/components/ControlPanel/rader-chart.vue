<template>
  <div id="market_raderchart"></div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/market_data.json";

export default {
  name: "ControlPanelRaderChart",
  props: {
    id: String,
  },
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 75, right: 75, bottom: 75, left: 75 },
      width: 200,
      height: 200,
      date: Object.keys(dataJSON["fund_size"]),
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
        .y((d) => this.yScale(d * 0.5));
    },
  },

  methods: {
    renderInit() {
      d3.select("#market_raderchart").attr("id", this.id);
      this.svg = d3
        .select(`#${this.id}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {

      let textgroup = this.svg.append("g").attr("font-size", "11");
      textgroup.append("text").attr("x", "14").attr("y", "-35").text("收益");
      textgroup
        .append("text")
        .attr("x", "-75")
        .attr("y", "4")
        .text("最大回撤率");
      textgroup.append("text").attr("x", "-30").attr("y", "85").text("风险");
      textgroup.append("text").attr("x", "42").attr("y", "85").text("机构占比");
      textgroup.append("text").attr("x", "77").attr("y", "4").text("规模");

      // 收益
      let curveChart1 = this.svg.append("g");
      // Add X axis
      curveChart1
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      // fund_return——紫色
      this.yScale.domain(d3.extent(this.fund_return));
      curveChart1
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");
      // .attr("transform","rotate()");

      curveChart1.attr("transform", "translate(-24.5,-25.5),rotate(90,50,50)");

      //最大回撤率
      let curveChart2 = this.svg.append("g");
      curveChart2
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      this.yScale.domain(d3.extent(this.fund_return));
      curveChart2
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");

      curveChart2.attr("transform", "translate(-25,-25.7),rotate(18,50,50)");

      //风险
      let curveChart3 = this.svg.append("g");
      curveChart3
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      this.yScale.domain(d3.extent(this.fund_return));
      curveChart3
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");

      curveChart3.attr("transform", "translate(-25.5,-25),rotate(-54,50,50)");

      //机构占比
      let curveChart4 = this.svg.append("g");
      curveChart4
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      this.yScale.domain(d3.extent(this.fund_return));
      curveChart4
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");

      curveChart4.attr("transform", "translate(-25,-24.5),rotate(-126,50,50)");

      //规模
      let curveChart5 = this.svg.append("g");
      curveChart5
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      this.yScale.domain(d3.extent(this.fund_return));
      curveChart5
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr("d", this.linePath(this.fund_return))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");

      curveChart5.attr("transform", "translate(-24,-25),rotate(162,50,50)");
    },
  },
};
</script>

<style scoped>
</style>