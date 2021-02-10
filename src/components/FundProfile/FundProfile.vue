<template>
  <div id="fund_profile">
    <div id="invest_style_boxes" ref="topElement" @scroll="topHandleScroll()">
      <InvestStyleBox :boxId="boxIds[0]" :boxText="boxTexts[0]" />
      <InvestStyleBox :boxId="boxIds[1]" :boxText="boxTexts[1]" />
      <InvestStyleBox :boxId="boxIds[2]" :boxText="boxTexts[2]" />
      <InvestStyleBox :boxId="boxIds[3]" :boxText="boxTexts[3]" />
      <InvestStyleBox :boxId="boxIds[4]" :boxText="boxTexts[4]" />
      <InvestStyleBox :boxId="boxIds[5]" :boxText="boxTexts[5]" />
      <InvestStyleBox :boxId="boxIds[6]" :boxText="boxTexts[6]" />
      <InvestStyleBox :boxId="boxIds[7]" :boxText="boxTexts[7]" />
    </div>
    <div id="curve"  ref="bottomElement" @scroll="bottomHandleScroll()"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import InvestStyleBox from "./InvestStyleBox";
import fakeDataJson from "@/data/test.json";

export default {
  name: "FundProfile",
  props: {},
  components: {
    InvestStyleBox,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 65, bottom: 10, left: 20 },
      width: 900,
      height: 200,
      data: fakeDataJson,
      boxIds: [..."abcdefghijk"],
      boxTexts: ['2008-03-24', '2008-06-24', '2008-09-24', '2008-12-24', '2009-03-24', '2009-06-24', '2009-09-24', '2009-12-24'],
      // isSyncTop: false,
      // isSyncBottom: false,
      flag:false,
    };
  },

  mounted: function() {
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
        .domain([new Date(this.data[0].date), new Date(this.data[510].date)]).nice()
        .range([this.margin.left, this.width - this.margin.right]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.data, d => d.value)]).nice()
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    line() {
      return d3
        .line()
        .defined(d => !isNaN(d.value))
        .x(d => this.xScale(new Date(d.date)))
        .y(d => this.yScale(d.value));
    }
  },

  methods: {
    topHandleScroll(){
        this.$refs.bottomElement.scrollLeft = this.$refs.topElement.scrollLeft;
    },
    bottomHandleScroll(){
      this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft;
    },
    renderInit() {
      // this.width = document.getElementById("invest_style_boxes").scrollWidth;
      this.width = 2500;
      this.svg = d3
        .select("#curve")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);

      // 同步滚动
      // const topElement = document.getElementById("invest_style_boxes");
      // const bottomElement = document.getElementById("curve");
      // topElement.onscroll = function() {
      //   if (!this.isSyncTop) {
      //     this.isSyncBottom = true;
      //     bottomElement.scrollLeft = this.scrollLeft;
      //   }
      //   this.isSyncTop = false;
      // }
      // bottomElement.onscroll = function() {
      //   if (!this.isSyncBottom) {
      //     this.isSyncTop = true;
      //     topElement.scrollLeft = this.scrollLeft;
      //   }
      //   this.isSyncBottom = false;
      // }
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      const xAxis = d3
        .axisTop(this.xScale)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d => {
          if (d3.timeYear(d) < d) {
            return d3.timeFormat("%b")(d);
          } else {
            return d3.timeFormat("%Y")(d);
          }
        })
        .tickSizeOuter(0);
      this.svg.append("g")
        .attr("transform", `translate(0, ${this.height-20})`)
        .call(xAxis);

      this.svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", this.line(this.data));

      let lastPos = -90;
      this.boxIds.forEach((d, i) => {
        d3
          .select("#invest_style_box_" + d)
          .style("margin-left", this.xScale(new Date(this.boxTexts[i]))- 90 - (lastPos + 90) + 'px');
        lastPos = this.xScale(new Date(this.boxTexts[i]));
      });
      // console.log(document.getElementById("invest_style_boxes").scrollWidth);
    },
  },
};
</script>

<style scoped>
#fund_profile {
  position: relative;
  height: 200px;
  width: 900px;
  border: 1px solid black;
  margin: 5px;
}

#invest_style_boxes {
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#curve {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

</style>
