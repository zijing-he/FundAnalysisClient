<template>
  <div class="fund_profile">
    <div class="buttons">
      <svg class="icon" aria-hidden="true" @click="turnCounterClockwise()">
        <use xlink:href="#iconnishizhenxuanzhuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="turnClockwise()">
        <use xlink:href="#iconshunshizhenxuanzhuan"></use>
      </svg>
    </div>
    <div
      class="invest_style_boxes"
      ref="topElement"
      @scroll="topHandleScroll()"
    >
      <component
        :is="componentName"
        :ref="item.boxId"
        :boxId="item.boxId"
        :boxText="item.boxText"
        :innerRadius="item.innerRadius"
        :outerRadius="item.outerRadius"
        :datum="item.datum"
        :holdingData="item.holdingData"
        :dropData="item.dropData"
        :riskData="item.riskData"
        :navReturnData="item.navReturnData"
        :hs300Data="item.hs300Data"
        :stockData="item.stockData"
        :bondData="item.bondData"
        :cashData="item.cashData"
        :otherData="item.otherData"
        :sizeData="item.sizeData"
        :alphaData="item.alphaData"
        :betaData="item.betaData"
        :sharpData="item.sharpData"
        :infoData="item.infoData"
        :boxWidth="investStyleBoxWidth"
        :contentWidth="contentWidth"
        :boxGap="boxGap"
        :key="item.boxId"
        @clickBar="clickBar"
        v-for="item in investStyleBoxes"
      >
      </component>
    </div>
    <div
      class="curve"
      id="curve"
      ref="bottomElement"
      @scroll="bottomHandleScroll()"
    ></div>
    <div class="rects" id="rects"></div>
    <div class="select-box" id="selectBox">
      <a-select
        mode="tags"
        placeholder="Please select"
        size="small"
        :allowClear="true"
        :maxTagCount="1"
        style="width: 80%; margin-top: 2px;"
        :default-value="['alpha', 'beta', 'sharp']"
        @change="handleSelectChange"
      >
        <a-select-option :key="item" :value="item" v-for="item in rectData">
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import InvestStyleBox from "./InvestStyleBox";

export default {
  name: "FundProfile",
  props: {
    fundId: String,
    returnData: Object,
    carData: Object,
    stockData: Object,
    bondData: Object,
    cashData: Object,
    otherData: Object,
    avgSizeData: Object,
    alphaData: Object,
    betaData: Object,
    sharpData: Object,
    dropData: Object,
    infoData: Object,
    riskData: Object,
    weightData: Object,
  },
  components: {
    InvestStyleBox,
  },
  data() {
    return {
      componentName: "invest-style-box",
      svg: null,
      rectSvg: null,
      margin: { top: 10, right: 100, bottom: 100, left: 20 },
      // 2.26
      // margin: { top: 10, right: 160, bottom: 100, left: 20 },
      width: 900,
      height: 270,
      isSyncTop: false,
      isSyncBottom: false,
      dateData: [],
      detailNavReturnData: [],
      detailCarData: [],
      sizeData: [],
      investStyleBoxes: [],
      maxOuterRadius: 70,
      minOuterRadius: 55,
      thisReturnData: 0,
      thisCarData: 0,
      thisStockData: 0,
      thisBondData: 0,
      thisCashData: 0,
      thisOtherData: 0,
      thisSizeData: 0,
      thisAlphaData: 0,
      thisBetaData: 0,
      thisSharpData: 0,
      thisDropData: 0,
      thisInfoData: 0,
      thisRiskData: 0,
      thisWeightData: 0,
      allReturnData: this.returnData,
      allCarData: this.carData,
      allStockData: this.stockData,
      allBondData: this.bondData,
      allCashData: this.cashData,
      allOtherData: this.otherData,
      allSizeData: this.avgSizeData,
      allAlphaData: this.alphaData,
      allBetaData: this.betaData,
      allSharpData: this.sharpData,
      allDropData: this.dropData,
      allInfoData: this.infoData,
      allRiskData: this.riskData,
      allWeightData: this.weightData,
      rectMarginRight: 30,
      // 2.26
      // dropData_n: [],
      // riskData_n: [],
      // stockData_n: [],
      // bondData_n: [],
      // cashData_n: [],
      // otherData_n: [],
      // alphaData_n: [],
      // betaData_n: [],
      // sharpData_n: [],
      // infoData_n: [],
      investStyleBoxWidth: 200,
      contentWidth: 200,
      boxGap: 60,
      // version 4
      maxPathWidth: 60,
      minPathWidth: 30,
      rectData: [
        "return",
        "car",
        "stock",
        "bond",
        "cash",
        "other",
        "size",
        "alpha",
        "beta",
        "sharp",
        "drop",
        "info",
        "risk",
        "weight",
      ],
      rectObject: {},
      selectedRects: ["alpha", "beta", "sharp"],
    };
  },

  mounted: function() {
    const fundData = require(`@/data/FundProfile/${this.fundId}.json`);

    for (let i in fundData["detail"][this.fundId]) {
      // let tmpDetailCarData = fundData[i]["detail_car"];
      // let tmpRiskData = fundData[i]["risks"];
      // 2.26
      // if (["0331", "0630", "0930", "1231"].indexOf(i.substring(4)) === -1) {
      //   this.investStyleBoxWidth = 280;
      //   this.contentWidth = 275;
      //   this.boxGap = 800;
      //   this.margin.right = this.investStyleBoxWidth / 2 + 4;
      // }
      let tmpDetailCarData = fundData["detail"][this.fundId][i]["detail_car"];
      let tmpdetailNavReturnData =
        fundData["detail"][this.fundId][i]["detail_nav_return"];
      let tmpDateData = Object.keys(tmpDetailCarData);
      tmpDateData = tmpDateData.map(
        (d) => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`
      );
      this.sizeData.push(fundData["detail"][this.fundId][i]["size"]);
      this.dateData = [...this.dateData, ...tmpDateData];
      this.detailNavReturnData = [
        ...this.detailNavReturnData,
        ...Object.values(tmpdetailNavReturnData),
      ];
      // this.detailCarData = [
      //   ...this.detailCarData,
      //   ...Object.values(tmpDetailCarData),
      // ];
      this.detailCarData.push(Object.values(tmpDetailCarData));
      let holdingData = fundData["detail"][this.fundId][i]["holding"];
      let holdingDataKeys = Object.keys(holdingData)
        .sort((a, b) => holdingData[b] - holdingData[a])
        .slice(0, 10);
      let thisHoldingData = [];
      holdingDataKeys.forEach((d) => {
        thisHoldingData.push({
          name: d,
          value: holdingData[d],
        });
      });
      thisHoldingData = {
        name: "all",
        children: thisHoldingData,
      };

      // 2.26
      // this.dropData_n.push(fundData[i]["max_drop_down"]);
      // this.riskData_n.push(fundData[i]["risk"]);
      // this.stockData_n.push(fundData[i]["stock"]);
      // this.bondData_n.push(fundData[i]["bond"]);
      // this.cashData_n.push(fundData[i]["cash"]);
      // this.otherData_n.push(fundData[i]["other"]);
      // this.alphaData_n.push(fundData[i]["alpha"]);
      // this.betaData_n.push(fundData[i]["beta"]);
      // this.sharpData_n.push(fundData[i]["sharp_ratio"]);
      // this.infoData_n.push(fundData[i]["information_ratio"]);

      this.investStyleBoxes.push({
        boxId: this.fundId + "_" + tmpDateData[tmpDateData.length - 1],
        boxText: tmpDateData[tmpDateData.length - 1],
        datum: fundData["detail"][this.fundId][i],
        holdingData: thisHoldingData,
        navReturnData: fundData["detail"][this.fundId][i]["nav_return"],
        hs300Data: fundData["detail"][this.fundId][i]["hs300_return"],
        dropData: fundData["detail"][this.fundId][i]["max_drop_down"],
        riskData: fundData["detail"][this.fundId][i]["risk"],
        stockData: fundData["detail"][this.fundId][i]["stock"],
        bondData: fundData["detail"][this.fundId][i]["bond"],
        cashData: fundData["detail"][this.fundId][i]["cash"],
        otherData: fundData["detail"][this.fundId][i]["other"],
        alphaData: fundData["detail"][this.fundId][i]["alpha"],
        betaData: fundData["detail"][this.fundId][i]["beta"],
        sharpData: fundData["detail"][this.fundId][i]["sharp_ratio"],
        infoData: fundData["detail"][this.fundId][i]["information_ratio"],
      });
    }

    this.thisReturnData = fundData["total"][this.fundId]["return"];
    this.thisCarData = fundData["total"][this.fundId]["car"];
    this.thisStockData = fundData["total"][this.fundId]["stock"];
    this.thisBondData = fundData["total"][this.fundId]["bond"];
    this.thisCashData = fundData["total"][this.fundId]["cash"];
    this.thisOtherData = fundData["total"][this.fundId]["other"];
    this.thisSizeData = fundData["total"][this.fundId]["size"];
    this.thisAlphaData = fundData["total"][this.fundId]["alpha"];
    this.thisBetaData = fundData["total"][this.fundId]["beta"];
    this.thisSharpData = fundData["total"][this.fundId]["sharp_ratio"];
    this.thisDropData = fundData["total"][this.fundId]["max_drop_down"];
    this.thisInfoData = fundData["total"][this.fundId]["information_ratio"];
    this.thisRiskData = fundData["total"][this.fundId]["risk"];
    this.thisWeightData = fundData["total"][this.fundId]["instl_weight"];

    let maxSize = Math.max(...this.sizeData);
    let minSize = Math.min(...this.sizeData);
    let kOuter =
      (this.maxOuterRadius - this.minOuterRadius) / (maxSize - minSize);
    let bOuter = this.maxOuterRadius - kOuter * maxSize;
    this.investStyleBoxes.map((d, i) => {
      d.outerRadius = kOuter * this.sizeData[i] + bOuter;
      d.innerRadius = d.outerRadius * 0.8;
      // 2.26
      // d.dropData = this.dropData_n;
      // d.riskData = this.riskData_n;
      // d.stockData = this.stockData_n;
      // d.bondData = this.bondData_n;
      // d.cashData = this.cashData_n;
      // d.otherData = this.otherData_n;
      // d.sizeData = this.sizeData;
      // d.alphaData = this.alphaData_n;
      // d.betaData = this.betaData_n;
      // d.sharpData = this.sharpData_n;
      // d.infoData = this.infoData_n;
      // d.index = i;
      return d;
    });
    this.renderInit();
    this.renderUpdate();
  },

  updated: function() {
    this.rectObject = {
      return: {
        color: "steelblue",
        data: this.allReturnData,
        thisData: this.thisReturnData,
      },
      car: {
        color: "red",
        data: this.allCarData,
        thisData: this.thisCarData,
      },
      stock: {
        color: "#fbb4ae",
        data: this.allStockData,
        thisData: this.thisStockData,
      },
      bond: {
        color: "#b3cde3",
        data: this.allBondData,
        thisData: this.thisBondData,
      },
      cash: {
        color: "#ccebc5",
        data: this.allCashData,
        thisData: this.thisCashData,
      },
      other: {
        color: "#decbe4",
        data: this.allOtherData,
        thisData: this.thisOtherData,
      },
      size: {
        color: "orange",
        data: this.allSizeData,
        thisData: this.thisSizeData,
      },
      alpha: {
        color: "#f4cae4",
        data: this.allAlphaData,
        thisData: this.thisAlphaData,
      },
      beta: {
        color: "#fff2ae",
        data: this.allBetaData,
        thisData: this.thisBetaData,
      },
      sharp: {
        color: "#fdcdac",
        data: this.allSharpData,
        thisData: this.thisSharpData,
      },
      drop: {
        color: "purple",
        data: this.allDropData,
        thisData: this.thisDropData,
      },
      info: {
        color: "#cbd5e8",
        data: this.allInfoData,
        thisData: this.thisInfoData,
      },
      risk: {
        color: "#33a02c",
        data: this.allRiskData,
        thisData: this.thisRiskData,
      },
      weight: {
        color: "#e5d8bd",
        data: this.allWeightData,
        thisData: this.thisWeightData,
      },
    };
    this.updateMargin();
    this.updateRects();
    this.updateGapPath();
  },

  watch: {
    returnData: function(newVal, oldVal) {
      this.allReturnData = newVal;
    },
    carData: function(newVal, oldVal) {
      this.allCarData = newVal;
    },
    stockData: function(newVal, oldVal) {
      this.allStockData = newVal;
    },
    bondData: function(newVal, oldVal) {
      this.allBondData = newVal;
    },
    cashData: function(newVal, oldVal) {
      this.allCashData = newVal;
    },
    otherData: function(newVal, oldVal) {
      this.allOtherData = newVal;
    },
    avgSizeData: function(newVal, oldVal) {
      this.allSizeData = newVal;
    },
    alphaData: function(newVal, oldVal) {
      this.allAlphaData = newVal;
    },
    betaData: function(newVal, oldVal) {
      this.allBetaData = newVal;
    },
    sharpData: function(newVal, oldVal) {
      this.allSharpData = newVal;
    },
    dropData: function(newVal, oldVal) {
      this.allDropData = newVal;
    },
    infoData: function(newVal, oldVal) {
      this.allInfoData = newVal;
    },
    riskData: function(newVal, oldVal) {
      this.allRiskData = newVal;
    },
    weightData: function(newVal, oldVal) {
      this.allRiskData = newVal;
    },
  },

  computed: {
    xScale() {
      return d3
        .scaleTime()
        .domain([
          new Date(this.dateData[0]),
          new Date(this.dateData[this.dateData.length - 1]),
        ])
        .range([this.margin.left, this.width - this.margin.right]);
    },
    // yScale() {
    //   return d3
    //     .scaleLinear()
    //     .domain(d3.extent(this.detailNavReturnData)).nice()
    //     .range([this.height - this.margin.bottom, this.margin.top]);
    // },
    // line() {
    //   return d3
    //     .line()
    //     .x((d, i) => this.xScale(new Date(this.dateData[i])))
    //     .y(d => this.yScale(d));
    // },
    rectXScale() {
      return d3
        .scaleLinear()
        .range([
          0,
          document.getElementById(`rects_${this.fundId}`).clientWidth -
            this.rectMarginRight,
        ]);
    },
  },

  methods: {
    handleSelectChange(value) {
      console.log(`selected ${value}`);
      this.selectedRects = value;
      this.updateRects();
    },
    turnClockwise() {
      this.svg.select("#dashline").remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].turnClockwise();
      });
    },
    turnCounterClockwise() {
      this.svg.select("#dashline").remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].turnCounterClockwise();
      });
    },
    clickBar(type) {
      this.svg.select("#dashline").remove();
      const gDashline = this.svg.append("g").attr("id", "dashline");
      for (let i = 0; i < this.investStyleBoxes.length - 1; i++) {
        const startPoint = this.$refs[
          this.investStyleBoxes[i].boxId
        ].getSelectedBarCenterPoint(type);
        const endPoint = this.$refs[
          this.investStyleBoxes[i + 1].boxId
        ].getSelectedBarCenterPoint(type);
        const startX =
          this.xScale(new Date(this.investStyleBoxes[i].boxText)) -
          this.investStyleBoxWidth / 2 +
          60 +
          startPoint[0];
        const startY = 5 + 20 + startPoint[1];
        const endX =
          this.xScale(new Date(this.investStyleBoxes[i + 1].boxText)) -
          this.investStyleBoxWidth / 2 +
          60 +
          endPoint[0];
        const endY = 5 + 20 + endPoint[1];
        gDashline
          .append("path")
          .attr("stroke-dasharray", "5, 5")
          .attr("stroke", "black")
          .attr("d", `M ${startX} ${startY} L ${endX} ${endY}`);
        // 由于遮挡，内部的虚线只能由子组件绘制
        let k = (endY - startY) / (endX - startX);
        let b = startY - startX * k;
        let thisX =
          this.xScale(new Date(this.investStyleBoxes[i].boxText)) +
          this.investStyleBoxWidth / 2;
        let thisY = k * thisX + b;
        let thatX, thatY;
        if (["nav", "risk"].indexOf(type) !== -1) {
          // top
          thatX = 80;
          thatY = thisY - 20 - 5;
        } else if (["sharp", "info"].indexOf(type) !== -1) {
          // right
          thatX = 60 - (thisY - 20 - 5);
          thatY = 80;
        } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
          // bottom
          thatX = 0;
          thatY = 60 - (thisY - 20 - 5);
        } else {
          // left
          thatX = thisY - 20 - 5;
          thatY = 0;
        }
        // this.$refs[this.investStyleBoxes[i + 1].boxId].drawDashline(thatX, thatY);
      }
    },
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
      this.width =
        (this.investStyleBoxWidth + this.boxGap) * this.sizeData.length +
        this.margin.left +
        this.margin.right -
        this.investStyleBoxWidth / 2;
      d3.select("#curve").attr("id", `curve_${this.fundId}`);
      d3.select("#rects").attr("id", `rects_${this.fundId}`);
      d3.select("#selectBox").attr("id", `selectBox_${this.fundId}`);
      this.svg = d3
        .select(`#curve_${this.fundId}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);
      this.rectSvg = d3
        .select(`#rects_${this.fundId}`)
        .append("svg")
        .attr(
          "width",
          document.getElementById(`rects_${this.fundId}`).clientWidth
        )
        .attr("height", this.height)
        .attr("viewBox", [
          0,
          0,
          document.getElementById(`rects_${this.fundId}`).clientWidth,
          this.height,
        ]);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      const xAxis = d3
        .axisTop(this.xScale)
        .ticks(d3.timeMonth.every(1))
        .tickFormat((d) => {
          if (d3.timeYear(d) < d) {
            return d3.timeFormat("%b")(d);
          } else {
            return d3.timeFormat("%Y")(d);
          }
        })
        .tickSizeOuter(0);
      this.svg
        .append("g")
        .attr("transform", `translate(0, ${this.height - 20})`)
        .call(xAxis);

      // this.svg.append("path")
      //   .attr("fill", "none")
      //   .attr("stroke", "red")
      //   .attr("stroke-width", 10)
      //   .attr("stroke-linejoin", "round")
      //   .attr("stroke-linecap", "round")
      //   .attr("d", this.line(this.detailNavReturnData));

      // for (let i = 0; i < this.detailCarData.length - 1; i++) {
      //   if (this.detailCarData[i] < 0) {
      //     let path = `M${this.xScale(new Date(this.dateData[i]))}, ${this.yScale(this.detailNavReturnData[i])}`;
      //     path += `L${this.xScale(new Date(this.dateData[i + 1]))}, ${this.yScale(this.detailNavReturnData[i + 1])}`;
      //     this.svg.append("path")
      //       .attr("fill", "none")
      //       .attr("stroke", "green")
      //       .attr("stroke-width", 10)
      //       .attr("stroke-linejoin", "round")
      //       .attr("d", path);
      //   }
      // }

      // version 4
      // this.svg
      //   .append("path")
      //   .attr("fill", "none")
      //   .attr("stroke", "red")
      //   .attr("stroke-width", 30)
      //   .attr(
      //     "d",
      //     `M ${this.margin.left} 125 H ${this.width - this.margin.right}`
      //   );
    },
    updateMargin() {
      let lastPos = -this.investStyleBoxWidth / 2;
      this.investStyleBoxes.forEach((d) => {
        d3.select("#invest_style_box_" + d.boxId).style(
          "margin-left",
          this.xScale(new Date(d.boxText)) -
            this.investStyleBoxWidth / 2 -
            (lastPos + this.investStyleBoxWidth / 2) +
            "px"
        );
        lastPos = this.xScale(new Date(d.boxText));
      });
    },
    updateRects() {
      this.rectSvg.selectAll("g").remove();
      const gRects = this.rectSvg
        .append("g")
        .attr("transform", "translate(0, 54)");
      const rectHeight = 162 / this.selectedRects.length;
      for (let i = 0; i < this.selectedRects.length; i++) {
        this.rectXScale.domain([
          0,
          d3.max(this.rectObject[this.selectedRects[i]].data),
        ]);
        gRects
          .append("rect")
          .attr("fill", this.rectObject[this.selectedRects[i]].color)
          .attr("stroke", "black")
          .attr("x", 0)
          .attr("y", 0 + i * rectHeight)
          .attr(
            "width",
            this.rectXScale(this.rectObject[this.selectedRects[i]].thisData)
          )
          .attr("height", rectHeight);
      }
      // this.rectXScale.domain([0, d3.max(this.allAlphaData)]);
      // gRects
      //   .append("rect")
      //   .attr("fill", this.rectColors[0])
      //   .attr("stroke", "black")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", this.rectXScale(this.thisAlphaData) - this.rectXScale(0))
      //   .attr("height", 54);
      // this.rectXScale.domain([0, d3.max(this.allBetaData)]);
      // gRects
      //   .append("rect")
      //   .attr("fill", this.rectColors[1])
      //   .attr("stroke", "black")
      //   .attr("x", 0)
      //   .attr("y", 54)
      //   .attr("width", this.rectXScale(this.thisBetaData) - this.rectXScale(0))
      //   .attr("height", 54);
      // this.rectXScale.domain([0, d3.max(this.allSharpData)]);
      // gRects
      //   .append("rect")
      //   .attr("fill", this.rectColors[2])
      //   .attr("stroke", "black")
      //   .attr("x", 0)
      //   .attr("y", 108)
      //   .attr("width", this.rectXScale(this.thisSharpData) - this.rectXScale(0))
      //   .attr("height", 54);
    },
    updateGapPath() {
      const maxSize = Math.max(...this.sizeData);
      const minSize = Math.min(...this.sizeData);
      const k = (this.maxPathWidth - this.minPathWidth) / (maxSize - minSize);
      const b = this.maxPathWidth - k * maxSize;
      let tmpSum = 0;
      for (let i = 0; i < this.investStyleBoxes.length; i++) {
        const thisPathWidth = k * this.sizeData[i] + b;
        for (
          let j = 0;
          j < this.detailCarData[i].length &&
          tmpSum + j < this.dateData.length - 1;
          j++
        ) {
          this.svg
            .append("path")
            .attr("fill", "none")
            .attr("stroke", this.detailCarData[i][j] < 0 ? "green" : "red")
            .attr("stroke-width", thisPathWidth)
            .attr(
              "d",
              `M ${this.xScale(new Date(this.dateData[tmpSum + j]))} 125
              H ${this.xScale(new Date(this.dateData[tmpSum + j + 1]))}`
            );
        }
        tmpSum += this.detailCarData[i].length;
      }
    },
  },
};
</script>

<style scoped>
.fund_profile {
  position: relative;
  height: 270px;
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
  border: 1px solid black;
  z-index: 2;
  overflow-x: auto;
  overflow-y: hidden;
}

.rects {
  position: absolute;
  height: 100%;
  width: 20%;
  left: 80%;
  z-index: 1;
}

.invest_style_boxes::-webkit-scrollbar {
  display: none;
}

.buttons {
  position: absolute;
  display: flex;
  width: 80px;
  height: 30px;
  left: 20px;
  top: 22px;
  font-size: 30px;
  z-index: 999;
  justify-content: space-around;
}

.select-box {
  position: absolute;
  height: 20%;
  width: 20%;
  left: 80%;
  z-index: 2;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}
</style>
