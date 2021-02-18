<template>
  <div id="market_raderchart"></div>
</template>

<script>
import * as d3 from "d3";
import holder from "@/data/RaderChart/holder.json";
import income from "@/data/RaderChart/income.json";
import max_drop from "@/data/RaderChart/max_drop.json";
import risk from "@/data/RaderChart/risk.json";
import size from "@/data/RaderChart/size.json";

export default {
  name: "ControlPanelRaderChart",
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 75, right: 75, bottom: 75, left: 75 },
      width: 200,
      height: 200,
      incomeValue: Object.values(income),
      maxDropValue: Object.values(max_drop),
      riskValue: Object.values(risk),
      holderValue: Object.values(holder),
      sizeValue: Object.values(size),
    };
  },

  mounted: function () {
    console.log(this.holderValue);
    console.log(d3.max(this.riskValue, (d) => d.length));
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
      return d3.scaleLinear().range([0, this.innerWidth]).nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.holderValue, (d) => d.length)])
        .range([this.innerHeight, 0])
        .nice(); //以最大的为标准
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(i))
        .y((d) => this.yScale(d.length));
    },
  },

  methods: {
    renderInit() {
      this.svg = d3
        .select("#market_raderchart")
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

      // 中心点
      // this.svg
      //   .append("circle")
      //   .attr("cx", 25)
      //   .attr("cy", 25)
      //   .attr("r", 1)
      //   .attr("fill", "red");
      // svg起点：左上角（去除margin后剩余的点）
      // this.svg
      //   .append("circle")
      //   .attr("cx", 0)
      //   .attr("cy", 0)
      //   .attr("r", 1)
      //   .attr("fill", "green");
      // 旋转点（x轴位移后的零点：左下角）
      // this.svg
      //   .append("circle")
      //   .attr("cx", 0)
      //   .attr("cy", 50)
      //   .attr("r", 1)
      //   .attr("fill", "blue");

      // 收益
      let curveChart1 = this.svg.append("g");

      //个性化配置
      this.xScale.domain([0, this.incomeValue.length - 1]);

      // Add X axis
      curveChart1
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(1).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      curveChart1
        .append("g")
        .append("path")
        .attr("class", "line-path-income")
        .attr("d", this.linePath(this.incomeValue))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#CEBDED");
      curveChart1.attr("transform", "translate(25,-25),rotate(270,0,50)");

      //最大回撤率
      let curveChart2 = this.svg.append("g");

      this.xScale.domain([0, this.maxDropValue.length - 1]);
      // this.linePath.y((d) => this.yScale(d.length));

      curveChart2
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(1).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      curveChart2
        .append("g")
        .append("path")
        .attr("class", "line-path-maxDrop")
        .attr("d", this.linePath(this.maxDropValue))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#41B883");

      curveChart2.attr("transform", "translate(25,-25),rotate(198,0,50)");

      //风险

      let curveChart3 = this.svg.append("g");

      this.xScale.domain([0, this.riskValue.length - 1]);
      // this.linePath.y((d) => this.yScale(d.length * 0.05));

      curveChart3
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(1).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      curveChart3
        .append("g")
        .append("path")
        .attr("class", "line-path-risk")
        .attr("d", this.linePath(this.riskValue))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#2B62D9");

      curveChart3.attr("transform", "translate(25,-25),rotate(126,0,50)");

      //机构占比

      let curveChart4 = this.svg.append("g");
      this.xScale.domain([0, this.holderValue.length - 1]);
      // this.linePath.y((d) => this.yScale(d.length*0.5));

      curveChart4
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      curveChart4
        .append("g")
        .append("path")
        .attr("class", "line-path-holder")
        .attr("d", this.linePath(this.holderValue))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#FBD64A");
      curveChart4.attr("transform", "translate(25,-25),rotate(54,0,50)");

      //规模
      let curveChart5 = this.svg.append("g");
      this.xScale.domain([0, this.sizeValue.length - 1]);
      // this.linePath.y((d) => this.yScale(d.length*0.5));

      curveChart5
        .append("g")
        .call(d3.axisBottom(this.xScale).tickSize(0).tickValues([]))
        .attr("transform", `translate(0,${this.innerHeight})`);

      curveChart5
        .append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", this.linePath(this.sizeValue))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "#DE4030");

      curveChart5.attr("transform", "translate(25,-25),rotate(-18,0,50)");
    },
  },
};
</script>

<style scoped>
</style>