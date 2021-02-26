<template>
  <div class="fund_profile">
    <div class="invest_style_boxes" ref="topElement" @scroll="topHandleScroll()">
      <component :is="componentName"
        :boxId="item.boxId"
        :boxText="item.boxText"
        :innerRadius="item.innerRadius"
        :outerRadius="item.outerRadius"
        :datum="item.datum"
        :holdingDataKeys="item.holdingDataKeys"
        :holdingDataSorted="item.holdingDataSorted"
        :navData="item.navData"
        :riskData="item.riskData"
        :stockData="item.stockData"
        :bondData="item.bondData"
        :cashData="item.cashData"
        :otherData="item.otherData"
        :sizeData="item.sizeData"
        :alphaData="item.alphaData"
        :betaData="item.betaData"
        :sharpData="item.sharpData"
        :infoData="item.infoData"
        :index="item.index"
        :key="item.boxId"
        v-for="item in investStyleBoxes">
      </component>
    </div>
    <div class="curve" id="curve" ref="bottomElement" @scroll="bottomHandleScroll()"></div>
    <div class="rects" id="rects"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import InvestStyleBox from "./InvestStyleBox";

export default {
  name: "FundProfile",
  props: {
    fundId: String,
    alphaData: Object,
    betaData: Object,
    sharpData: Object,
  },
  components: {
    InvestStyleBox,
  },
  data() {
    return {
      componentName: "invest-style-box",
      svg: null,
      rectSvg: null,
      // margin: { top: 10, right: 80, bottom: 100, left: 20 },
      // 2.26
      margin: { top: 10, right: 160, bottom: 100, left: 20 },
      width: 900,
      height: 200,
      isSyncTop: false,
      isSyncBottom: false,
      dateData: [],
      riskData: [],
      navData: [],
      sizeData: [],
      investStyleBoxes: [],
      maxOuterRadius: 70,
      minOuterRadius: 55,
      rectColors: ["rgb(227, 247, 219)", "rgb(194, 173, 232)", "rgb(70, 174, 227)"],
      thisAlphaData: 0,
      thisBetaData: 0,
      thisSharpData: 0,
      allAlphaData: this.alphaData,
      allBetaData: this.betaData,
      allSharpData: this.sharpData,
      rectMarginRight: 30,
      // 2.26
      navData_n: [],
      riskData_n: [],
      stockData_n: [],
      bondData_n: [],
      cashData_n: [],
      otherData_n: [],
      alphaData_n: [],
      betaData_n: [],
      sharpData_n: [],
      infoData_n: [],
    };
  },

  mounted: function() {
    const fundData = require(`@/data/FundProfile/${this.fundId}.json`);

    for (let i in fundData) {
      let tmpNavData = fundData[i]["navs"];
      let tmpRiskData = fundData[i]["risks"];
      let tmpDateData = Object.keys(tmpNavData);
      tmpDateData = tmpDateData.map(d => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`);
      this.sizeData.push(fundData[i]["size"]);
      this.dateData = [...this.dateData, ...tmpDateData];
      this.riskData = [...this.riskData, ...Object.values(tmpRiskData)];
      this.navData = [...this.navData, ...Object.values(tmpNavData)];
      let holdingData = fundData[i]["holding"];
      let holdingDataKeys = Object.keys(holdingData).sort((a, b) => holdingData[b] - holdingData[a]).slice(0, 8);
      let holdingDataSorted = [];
      holdingDataKeys.forEach(d => {
        holdingDataSorted.push(holdingData[d]);
      });

      // 2.26
      this.navData_n.push(fundData[i]["nav"]);
      this.riskData_n.push(fundData[i]["risk"]);
      this.stockData_n.push(fundData[i]["stock"]);
      this.bondData_n.push(fundData[i]["bond"]);
      this.cashData_n.push(fundData[i]["cash"]);
      this.otherData_n.push(fundData[i]["other"]);
      this.alphaData_n.push(fundData[i]["alpha"]);
      this.betaData_n.push(fundData[i]["beta"]);
      this.sharpData_n.push(fundData[i]["sharp_ratio"]);
      this.infoData_n.push(fundData[i]["information_ratio"]);

      this.investStyleBoxes.push({
        boxId: this.fundId + "_" + tmpDateData[tmpDateData.length - 1],
        boxText: tmpDateData[tmpDateData.length - 1],
        datum: fundData[i],
        holdingDataKeys: holdingDataKeys,
        holdingDataSorted: holdingDataSorted,
      });
    }

    const keys = Object.keys(fundData);
    this.thisAlphaData = fundData[keys[keys.length - 1]]["alpha"];
    this.thisBetaData = fundData[keys[keys.length - 1]]["beta"];
    this.thisSharpData = fundData[keys[keys.length - 1]]["sharp_ratio"];

    let maxSize = Math.max(...this.sizeData);
    let minSize = Math.min(...this.sizeData);
    let kOuter = (this.maxOuterRadius - this.minOuterRadius) / (maxSize - minSize);
    let bOuter = this.maxOuterRadius - kOuter * maxSize;
    this.investStyleBoxes.map((d, i) => {
      d.outerRadius = kOuter * this.sizeData[i] + bOuter;
      d.innerRadius = d.outerRadius * 0.8;
      // 2.26
      d.navData = this.navData_n;
      d.riskData = this.riskData_n;
      d.stockData = this.stockData_n;
      d.bondData = this.bondData_n;
      d.cashData = this.cashData_n;
      d.otherData = this.otherData_n;
      d.sizeData = this.sizeData;
      d.alphaData = this.alphaData_n;
      d.betaData = this.betaData_n;
      d.sharpData = this.sharpData_n;
      d.infoData = this.infoData_n;
      d.index = i;
      return d;
    });
    this.renderInit();
    this.renderUpdate();
  },

  updated: function() {
    this.updateMargin();
    this.updateRects();
  },

  watch: {
    alphaData: function(newVal, oldVal) {
      this.allAlphaData = newVal;
    },
    betaData: function(newVal, oldVal) {
      this.allBetaData = newVal;
    },
    sharpData: function(newVal, oldVal) {
      this.allSharpData = newVal;
    },
  },

  computed: {
    xScale() {
      return d3
        .scaleTime()
        .domain([new Date(this.dateData[0]), new Date(this.dateData[this.dateData.length - 1])])
        .range([this.margin.left, this.width - this.margin.right]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.riskData)]).nice()
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    line() {
      return d3
        .line()
        .x((d, i) => this.xScale(new Date(this.dateData[i])))
        .y(d => this.yScale(d));
    },
    alphaXScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.allAlphaData)])
        .range([0, document.getElementById(`rects_${this.fundId}`).clientWidth - this.rectMarginRight]);
    },
    betaXScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.allBetaData)])
        .range([0, document.getElementById(`rects_${this.fundId}`).clientWidth - this.rectMarginRight]);
    },
    sharpXScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.allSharpData)])
        .range([0, document.getElementById(`rects_${this.fundId}`).clientWidth - this.rectMarginRight]);
    },
  },

  methods: {
    topHandleScroll() {
      if (!this.isSyncTop) {
        this.isSyncBottom = true;
        this.$refs.bottomElement.scrollLeft = this.$refs.topElement.scrollLeft;
      }
      this.isSyncTop = false;
    },
    bottomHandleScroll() {
      if (!this.isSyncBottom) {
        this.isSyncTop = true;
        this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft;
      }
      this.isSyncBottom = false;
    },
    renderInit() {
      // this.width = (156 + 60) * this.sizeData.length + this.margin.left + this.margin.right - 78;
      // 2.26
      this.width = (312 + 60) * this.sizeData.length + this.margin.left + this.margin.right - 156;
      d3.select("#curve").attr("id", `curve_${this.fundId}`);
      d3.select("#rects").attr("id", `rects_${this.fundId}`);
      this.svg = d3
        .select(`#curve_${this.fundId}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);
      this.rectSvg = d3
        .select(`#rects_${this.fundId}`)
        .append("svg")
        .attr("width", document.getElementById(`rects_${this.fundId}`).clientWidth)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, document.getElementById(`rects_${this.fundId}`).clientWidth, this.height]);
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
        .attr("transform", `translate(0, ${this.height})`)
        .call(xAxis);

      this.svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", this.line(this.riskData));
      
      for (let i = 0; i < this.navData.length - 1; i++) {
        if (this.navData[i] < 1) {
          let path = `M${this.xScale(new Date(this.dateData[i]))}, ${this.yScale(this.riskData[i])}`;
          path += `L${this.xScale(new Date(this.dateData[i + 1]))}, ${this.yScale(this.riskData[i + 1])}`;
          this.svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 10)
            .attr("stroke-linejoin", "round")
            .attr("d", path);
        }
      }
    },
    updateMargin() {
      // let lastPos = -78;
      let lastPos = -156;
      this.investStyleBoxes.forEach(d => {
        // d3
        //   .select("#invest_style_box_" + d.boxId)
        //   .style("margin-left", this.xScale(new Date(d.boxText)) - 78 - (lastPos + 78) + 'px');
        // 2.26
        d3
          .select("#invest_style_box_" + d.boxId)
          .style("margin-left", this.xScale(new Date(d.boxText)) - 156 - (lastPos + 156) + 'px');
        lastPos = this.xScale(new Date(d.boxText));
      });
    },
    updateRects() {
      const gRects = this.rectSvg.append("g").attr("transform", "translate(0, 40)");
      gRects
        .append("rect")
        .attr("fill", this.rectColors[0])
        .attr("stroke", "black")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.alphaXScale(this.thisAlphaData) - this.alphaXScale(0))
        .attr("height", 40);
      gRects
        .append("rect")
        .attr("fill", this.rectColors[1])
        .attr("stroke", "black")
        .attr("x", 0)
        .attr("y", 40)
        .attr("width", this.betaXScale(this.thisBetaData) - this.betaXScale(0))
        .attr("height", 40);
      gRects
        .append("rect")
        .attr("fill", this.rectColors[2])
        .attr("stroke", "black")
        .attr("x", 0)
        .attr("y", 80)
        .attr("width", this.sharpXScale(this.thisSharpData) - this.sharpXScale(0))
        .attr("height", 40);
    },
  },
};
</script>

<style scoped>
.fund_profile {
  position: relative;
  height: 200px;
  width: 100%;
  /* border: 1px solid black; */
  /* margin: 5px 0; */
}

.invest_style_boxes {
  position: absolute;
  display: flex;
  height: 100%;
  width: 80%;
  border: 1px solid black;
  overflow-x: auto;
  overflow-y: hidden;
}

.curve {
  position: absolute;
  height: 100%;
  width: 80%;
  z-index: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.curve::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.rects {
  position: absolute;
  height: 100%;
  width: 20%;
  left: 80%;
}
</style>
