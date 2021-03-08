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
        :max_drop_downData="item.max_drop_downData"
        :riskData="item.riskData"
        :nav_returnData="item.nav_returnData"
        :hs300Data="item.hs300Data"
        :stockData="item.stockData"
        :bondData="item.bondData"
        :cashData="item.cashData"
        :otherData="item.otherData"
        :sizeData="item.sizeData"
        :alphaData="item.alphaData"
        :betaData="item.betaData"
        :sharp_ratioData="item.sharp_ratioData"
        :information_ratioData="item.information_ratioData"
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
    <div class="rects" id="rects">
      <div class="tooltip" id="tooltip"></div>
    </div>
    <div class="select-box" id="selectBox">
      <a-select
        mode="tags"
        placeholder="Please select"
        size="small"
        :allowClear="true"
        :maxTagCount="1"
        style="width: 80%; margin-top: 2px;"
        :default-value="selectedRectsCN"
        @change="handleSelectChange"
      >
        <a-select-option :key="item" :value="item" v-for="item in rectDataCN">
          {{ item }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import InvestStyleBox from "./InvestStyleBox";
import weightKey from "@/data/FundProfile/weight_key.json";

export default {
  name: "FundProfile",
  props: {
    fundData: Object,
    fundIds: Object,
    fundId: String,
    startDate: String,
    endDate: String,
    boxHeight: Number,
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
      emptyBoxes: [], // 为同步不同FundProfile的长度
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
      allReturnData: [],
      allCarData: [],
      allStockData: [],
      allBondData: [],
      allCashData: [],
      allOtherData: [],
      allSizeData: [],
      allAlphaData: [],
      allBetaData: [],
      allSharpData: [],
      allDropData: [],
      allInfoData: [],
      allRiskData: [],
      allWeightData: [],
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
      boxGap: 200,
      // version 4
      maxPathWidth: 60,
      minPathWidth: 30,
      rectDataKeys: [
        "nav_return",
        "car",
        "stock",
        "bond",
        "cash",
        "other",
        "size",
        "alpha",
        "beta",
        "sharp_ratio",
        "max_drop_down",
        "information_ratio",
        "risk",
        "instl_weight",
      ],
      rectObject: {},
      selectedRectKeys: ["alpha", "beta", "sharp_ratio"],
    };
  },

  mounted: function() {
    this.fundIds.forEach((d) => {
      this.allReturnData.push(this.fundData["total"][d]["return"]);
      this.allCarData.push(this.fundData["total"][d]["car"]);
      this.allStockData.push(this.fundData["total"][d]["stock"]);
      this.allBondData.push(this.fundData["total"][d]["bond"]);
      this.allCashData.push(this.fundData["total"][d]["cash"]);
      this.allOtherData.push(this.fundData["total"][d]["other"]);
      this.allSizeData.push(this.fundData["total"][d]["size"].norm);
      this.allAlphaData.push(this.fundData["total"][d]["alpha"].norm);
      this.allBetaData.push(this.fundData["total"][d]["beta"].norm);
      this.allSharpData.push(this.fundData["total"][d]["sharp_ratio"].norm);
      this.allDropData.push(this.fundData["total"][d]["max_drop_down"]);
      this.allInfoData.push(
        this.fundData["total"][d]["information_ratio"].norm
      );
      this.allRiskData.push(this.fundData["total"][d]["risk"].norm);
      this.allWeightData.push(this.fundData["total"][d]["instl_weight"]);
    });

    for (let i in this.fundData["detail"][this.fundId]) {
      if (Object.keys(this.fundData["detail"][this.fundId][i]).length === 0) {
        this.emptyBoxes.push(i);
        continue;
      }
      let tmpDetailCarData = this.fundData["detail"][this.fundId][i][
        "detail_car"
      ];
      let tmpdetailNavReturnData = this.fundData["detail"][this.fundId][i][
        "detail_nav_return"
      ];
      let tmpDateData = Object.keys(tmpDetailCarData);
      tmpDateData = tmpDateData.map(
        (d) => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`
      );
      this.sizeData.push(this.fundData["detail"][this.fundId][i]["size"].norm);
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
      let holdingData = this.fundData["detail"][this.fundId][i]["holding"];
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

      this.investStyleBoxes.push({
        boxId: this.fundId + "_" + tmpDateData[tmpDateData.length - 1],
        boxText: tmpDateData[tmpDateData.length - 1],
        datum: this.fundData["detail"][this.fundId][i],
        holdingData: thisHoldingData,
        nav_returnData: this.fundData["detail"][this.fundId][i]["nav_return"],
        hs300Data: this.fundData["detail"][this.fundId][i]["hs300_return"],
        max_drop_downData: this.fundData["detail"][this.fundId][i][
          "max_drop_down"
        ],
        riskData: this.fundData["detail"][this.fundId][i]["risk"],
        stockData: this.fundData["detail"][this.fundId][i]["stock"],
        bondData: this.fundData["detail"][this.fundId][i]["bond"],
        cashData: this.fundData["detail"][this.fundId][i]["cash"],
        otherData: this.fundData["detail"][this.fundId][i]["other"],
        alphaData: this.fundData["detail"][this.fundId][i]["alpha"],
        betaData: this.fundData["detail"][this.fundId][i]["beta"],
        sharp_ratioData: this.fundData["detail"][this.fundId][i]["sharp_ratio"],
        information_ratioData: this.fundData["detail"][this.fundId][i][
          "information_ratio"
        ],
      });
    }

    this.thisReturnData = this.fundData["total"][this.fundId]["return"];
    this.thisCarData = this.fundData["total"][this.fundId]["car"];
    this.thisStockData = this.fundData["total"][this.fundId]["stock"];
    this.thisBondData = this.fundData["total"][this.fundId]["bond"];
    this.thisCashData = this.fundData["total"][this.fundId]["cash"];
    this.thisOtherData = this.fundData["total"][this.fundId]["other"];
    this.thisSizeData = this.fundData["total"][this.fundId]["size"];
    this.thisAlphaData = this.fundData["total"][this.fundId]["alpha"];
    this.thisBetaData = this.fundData["total"][this.fundId]["beta"];
    this.thisSharpData = this.fundData["total"][this.fundId]["sharp_ratio"];
    this.thisDropData = this.fundData["total"][this.fundId]["max_drop_down"];
    this.thisInfoData = this.fundData["total"][this.fundId][
      "information_ratio"
    ];
    this.thisRiskData = this.fundData["total"][this.fundId]["risk"];
    this.thisWeightData = this.fundData["total"][this.fundId]["instl_weight"];

    this.rectObject = {
      nav_return: {
        color: "#ff7f00",
        data: this.allReturnData,
        thisData: this.thisReturnData,
      },
      car: {
        color: "#fddaec",
        data: this.allCarData,
        thisData: this.thisCarData,
      },
      stock: {
        color: "#a65628",
        data: this.allStockData,
        thisData: this.thisStockData,
      },
      bond: {
        color: "#377eb8",
        data: this.allBondData,
        thisData: this.thisBondData,
      },
      cash: {
        color: "#f781bf",
        data: this.allCashData,
        thisData: this.thisCashData,
      },
      other: {
        color: "#999999",
        data: this.allOtherData,
        thisData: this.thisOtherData,
      },
      size: {
        color: "#e5d8bd",
        data: this.allSizeData,
        thisData: this.thisSizeData,
      },
      alpha: {
        color: "#ffff33",
        data: this.allAlphaData,
        thisData: this.thisAlphaData,
      },
      beta: {
        color: "#ffffcc",
        data: this.allBetaData,
        thisData: this.thisBetaData,
      },
      sharp_ratio: {
        color: "#984ea3",
        data: this.allSharpData,
        thisData: this.thisSharpData,
      },
      max_drop_down: {
        color: "#b3cde3",
        data: this.allDropData,
        thisData: this.thisDropData,
      },
      information_ratio: {
        color: "#decbe4",
        data: this.allInfoData,
        thisData: this.thisInfoData,
      },
      risk: {
        color: "#fed9a6",
        data: this.allRiskData,
        thisData: this.thisRiskData,
      },
      instl_weight: {
        color: "#f2f2f2",
        data: this.allWeightData,
        thisData: this.thisWeightData,
      },
    };

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
    this.updateMargin();
    this.updateRects();
    this.updateGapPath();
  },

  computed: {
    xScale() {
      return d3
        .scaleTime()
        .domain([
          new Date(
            `${this.startDate.substring(0, 4)}-${this.startDate.substring(
              4,
              6
            )}-${this.startDate.substring(6)}`
          ),
          new Date(
            `${this.endDate.substring(0, 4)}-${this.endDate.substring(
              4,
              6
            )}-${this.endDate.substring(6)}`
          ),
        ])
        .range([this.margin.left, this.width - this.margin.right]);
    },
    rectXScale() {
      return d3
        .scaleLinear()
        .range([
          0,
          document.getElementById(`rects_${this.fundId}`).clientWidth -
            this.rectMarginRight,
        ]);
    },
    selectedRectsEN() {
      return this.selectedRectKeys.map((d) => weightKey[d].en_name);
    },
    selectedRectsCN() {
      return this.selectedRectKeys.map((d) => weightKey[d].cn_name);
    },
    rectDataEN() {
      return this.rectDataKeys.map((d) => weightKey[d].en_name);
    },
    rectDataCN() {
      return this.rectDataKeys.map((d) => weightKey[d].cn_name);
    },
  },

  methods: {
    handleSelectChange(value) {
      this.$emit("handleSelect", value);
    },
    handleSelect(value) {
      // console.log(`selected ${value}`);
      this.selectedRectKeys = [];
      value.forEach((d) => {
        for (let i = 0; i < this.rectDataKeys.length; i++) {
          if (weightKey[this.rectDataKeys[i]].cn_name === d) {
            this.selectedRectKeys.push(this.rectDataKeys[i]);
            break;
          }
        }
      });
      this.updateRects();
    },
    turnClockwise() {
      this.svg.select("#dashline").remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
        this.$refs[d.boxId].turnClockwise();
      });
    },
    turnCounterClockwise() {
      this.svg.select("#dashline").remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
        this.$refs[d.boxId].turnCounterClockwise();
      });
    },
    clickBar(type) {
      this.svg.select("#dashline").remove();
      const gDashline = this.svg.append("g").attr("id", "dashline");

      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
      });

      // only consider nonnegative values
      let selectedBoxIndices = [];
      for (let i = 0; i < this.investStyleBoxes.length; i++) {
        let value;
        if (
          [
            "nav_return",
            "risk",
            "alpha",
            "beta",
            "sharp_ratio",
            "information_ratio",
          ].indexOf(type) !== -1
        )
          value = eval(`this.investStyleBoxes[${i}].${type}Data.norm`).toFixed(
            2
          );
        else value = eval(`this.investStyleBoxes[${i}].${type}Data`).toFixed(2);
        if (value >= 0) {
          selectedBoxIndices.push(i);
        }
      }

      let thisK, thisB, lastK, lastB;
      for (let i = 0; i < selectedBoxIndices.length - 1; i++) {
        const startPoint = this.$refs[
          this.investStyleBoxes[selectedBoxIndices[i]].boxId
        ].getSelectedBarCenterPoint(type);
        const endPoint = this.$refs[
          this.investStyleBoxes[selectedBoxIndices[i + 1]].boxId
        ].getSelectedBarCenterPoint(type);
        const startX =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i]].boxText)
          ) -
          this.investStyleBoxWidth / 2 +
          60 +
          startPoint[0];
        const startY = 5 + 20 + startPoint[1];
        const endX =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i + 1]].boxText)
          ) -
          this.investStyleBoxWidth / 2 +
          60 +
          endPoint[0];
        const endY = 5 + 20 + endPoint[1];
        gDashline
          .append("path")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr("d", `M ${startX} ${startY} L ${endX} ${endY}`);

        // 由于遮挡，内部的虚线只能由子组件绘制
        thisK = (endY - startY) / (endX - startX);
        thisB = startY - startX * thisK;

        // 可能横跨多个组件
        for (
          let j = selectedBoxIndices[i] + 1;
          j < selectedBoxIndices[i + 1];
          j++
        ) {
          let traverseStartX =
            this.xScale(new Date(this.investStyleBoxes[j].boxText)) -
            this.investStyleBoxWidth / 2;
          let traverseEndX =
            this.xScale(new Date(this.investStyleBoxes[j].boxText)) +
            this.investStyleBoxWidth / 2;
          let traverseStartY = thisK * traverseStartX + thisB;
          let traverseEndY = thisK * traverseEndX + thisB;
          if (["nav_return", "risk"].indexOf(type) !== -1) {
            // top
            traverseStartX = 0;
            traverseStartY = traverseStartY - 20 - 5;
            traverseEndX = 200;
            traverseEndY = traverseEndY - 20 - 5;
          } else if (
            ["sharp_ratio", "information_ratio"].indexOf(type) !== -1
          ) {
            // right
            traverseStartX = 60 - (traverseStartY - 20 - 5);
            traverseStartY = 0;
            traverseEndX = 60 - (traverseEndY - 20 - 5);
            traverseEndY = 200;
          } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
            // bottom
            traverseStartX = 200;
            traverseStartY = 60 - (traverseStartY - 20 - 5);
            traverseEndX = 0;
            traverseEndY = 60 - (traverseEndY - 20 - 5);
          } else {
            // left
            traverseStartX = traverseStartY - 20 - 5;
            traverseStartY = 200;
            traverseEndX = traverseEndY - 20 - 5;
            traverseEndY = 0;
          }
          this.$refs[this.investStyleBoxes[j].boxId].drawTraverseDashline(
            traverseStartX,
            traverseStartY,
            traverseEndX,
            traverseEndY
          );
        }

        let thisX1 =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i]].boxText)
          ) -
          this.investStyleBoxWidth / 2;
        let thisY1 = lastK * thisX1 + lastB;
        let thisX2 =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i]].boxText)
          ) +
          this.investStyleBoxWidth / 2;
        let thisY2 = thisK * thisX2 + thisB;
        let thatX1, thatY1, thatX2, thatY2;
        if (["nav_return", "risk"].indexOf(type) !== -1) {
          // top
          thatX1 = 0;
          thatY1 = thisY1 - 20 - 5;
          thatX2 = 200;
          thatY2 = thisY2 - 20 - 5;
        } else if (["sharp_ratio", "information_ratio"].indexOf(type) !== -1) {
          // right
          thatX1 = 60 - (thisY1 - 20 - 5);
          thatY1 = 0;
          thatX2 = 60 - (thisY2 - 20 - 5);
          thatY2 = 200;
        } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
          // bottom
          thatX1 = 200;
          thatY1 = 60 - (thisY1 - 20 - 5);
          thatX2 = 0;
          thatY2 = 60 - (thisY2 - 20 - 5);
        } else {
          // left
          thatX1 = thisY1 - 20 - 5;
          thatY1 = 200;
          thatX2 = thisY2 - 20 - 5;
          thatY2 = 0;
        }
        if (i === 0) {
          this.$refs[
            this.investStyleBoxes[selectedBoxIndices[i]].boxId
          ].drawDashline(thatX1, thatY1, thatX2, thatY2, true, false);
        } else {
          this.$refs[
            this.investStyleBoxes[selectedBoxIndices[i]].boxId
          ].drawDashline(thatX1, thatY1, thatX2, thatY2, false, false);
        }
        lastK = thisK;
        lastB = thisB;
      }
      let lastTmpX =
        this.xScale(
          new Date(
            this.investStyleBoxes[
              selectedBoxIndices[selectedBoxIndices.length - 1]
            ].boxText
          )
        ) -
        this.investStyleBoxWidth / 2;
      let lastTmpY = lastK * lastTmpX + lastB;
      let lastX, lastY;
      if (["nav_return", "risk"].indexOf(type) !== -1) {
        // top
        lastX = 0;
        lastY = lastTmpY - 20 - 5;
      } else if (["sharp_ratio", "information_ratio"].indexOf(type) !== -1) {
        // right
        lastX = 60 - (lastTmpY - 20 - 5);
        lastY = 0;
      } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
        // bottom
        lastX = 200;
        lastY = 60 - (lastTmpY - 20 - 5);
      } else {
        // left
        lastX = lastTmpY - 20 - 5;
        lastY = 200;
      }
      this.$refs[
        this.investStyleBoxes[selectedBoxIndices[selectedBoxIndices.length - 1]]
          .boxId
      ].drawDashline(lastX, lastY, -1, -1, false, true);
    },
    topHandleScroll() {
      this.$emit("handleScroll", this.$refs.topElement.scrollLeft);
      if (!this.isSyncTop) {
        this.isSyncBottom = true;
        this.$refs.bottomElement.scrollLeft = this.$refs.topElement.scrollLeft;
      }
      this.isSyncTop = false;
    },
    bottomHandleScroll() {
      this.$emit("handleScroll", this.$refs.bottomElement.scrollLeft);
      if (!this.isSyncBottom) {
        this.isSyncTop = true;
        this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft;
      }
      this.isSyncBottom = false;
    },
    handleScroll(value) {
      this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft = value;
    },
    renderInit() {
      // this.width = (156 + 60) * this.sizeData.length + this.margin.left + this.margin.right - 78;
      // 2.26
      this.width = Math.max(
        (this.investStyleBoxWidth + this.boxGap) *
          (this.investStyleBoxes.length + this.emptyBoxes.length) +
          this.margin.left +
          this.margin.right -
          this.investStyleBoxWidth / 2,
        this.width
      );
      d3.select("#curve").attr("id", `curve_${this.fundId}`);
      d3.select("#rects").attr("id", `rects_${this.fundId}`);
      d3.select("#tooltip").attr("id", `tooltip_${this.fundId}`);
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
      d3.select(`#invest_style_box_${this.investStyleBoxes[0].boxId}`).style(
        "margin-left",
        this.xScale(new Date(this.investStyleBoxes[0].boxText)) -
          this.investStyleBoxWidth / 2 +
          "px"
      );
      let lastPos = this.xScale(new Date(this.investStyleBoxes[0].boxText));
      for (let i = 1; i < this.investStyleBoxes.length; i++) {
        d3.select("#invest_style_box_" + this.investStyleBoxes[i].boxId).style(
          "margin-left",
          this.xScale(new Date(this.investStyleBoxes[i].boxText)) -
            this.investStyleBoxWidth / 2 -
            (lastPos + this.investStyleBoxWidth / 2) +
            "px"
        );
        lastPos = this.xScale(new Date(this.investStyleBoxes[i].boxText));
      }
      // console.log(this.emptyBoxes);
      // this.investStyleBoxes.forEach((d) => {
      //   console.log(d.boxText);
      //   d3.select("#invest_style_box_" + d.boxId).style(
      //     "margin-left",
      //     this.xScale(new Date(d.boxText)) -
      //       this.investStyleBoxWidth / 2 -
      //       (lastPos + this.investStyleBoxWidth / 2) +
      //       "px"
      //   );
      //   lastPos = this.xScale(new Date(d.boxText));
      // });
    },
    updateRects() {
      let that = this;
      this.rectSvg.selectAll("g").remove();
      const defs = this.rectSvg.append("defs");
      defs
        .append("pattern")
        .attr("id", `pattern_stripe_${this.fundId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      defs
        .append("mask")
        .attr("id", `mask_stripe_${this.fundId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#pattern_stripe_${this.fundId})`);
      const gRects = this.rectSvg
        .append("g")
        .attr("transform", "translate(0, 54)");
      const rectHeight = 162 / this.selectedRectKeys.length;
      for (let i = 0; i < this.selectedRectKeys.length; i++) {
        if (["size", "risk"].indexOf(this.selectedRectKeys[i]) !== -1)
          this.rectXScale.domain([0, 1.1]);
        else
          this.rectXScale.domain([0, 1]);
        // this.rectXScale.domain([
        //   d3.min(this.rectObject[this.selectedRectKeys[i]].data),
        //   d3.max(this.rectObject[this.selectedRectKeys[i]].data),
        // ]);
        let thisData, value;
        if (
          [
            "size",
            "risk",
            "alpha",
            "beta",
            "sharp_ratio",
            "information_ratio",
          ].indexOf(this.selectedRectKeys[i]) !== -1
        ) {
          thisData = this.rectObject[this.selectedRectKeys[i]].thisData.norm;
          value = this.rectObject[
            this.selectedRectKeys[i]
          ].thisData.value.toFixed(2);
        } else {
          thisData = this.rectObject[this.selectedRectKeys[i]].thisData;
          value = thisData.toFixed(2);
        }
        console.log(this.selectedRectKeys[i], thisData);
        gRects
          .append("rect")
          .attr("fill", this.rectObject[this.selectedRectKeys[i]].color)
          .attr("mask", thisData < 0 ? `url(#mask_stripe_${this.fundId})` : "none")
          .attr("stroke", "black")
          .attr("x", 0)
          .attr("y", 0 + i * rectHeight)
          .attr("width", this.rectXScale(Math.abs(thisData)))
          .attr("height", rectHeight)
          .on("mouseover", function() {
            d3.select(`#tooltip_${that.fundId}`).style("display", "block");
          })
          .on("mousemove", function(e) {
            let key = that.selectedRectsCN[i];
            d3.select(`#tooltip_${that.fundId}`)
              .html(key + "<br>" + value)
              .style("left", e.offsetX + 10 + "px")
              .style("top", e.offsetY + 10 + "px");
          })
          .on("mouseout", function() {
            d3.select(`#tooltip_${that.fundId}`).style("display", "none");
          });
      }
    },
    updateGapPath() {
      const maxSize = Math.max(...this.sizeData);
      const minSize = Math.min(...this.sizeData);
      const k = (this.maxPathWidth - this.minPathWidth) / (maxSize - minSize);
      const b = this.maxPathWidth - k * maxSize;
      let tmpSum = 0;
      for (let i = 0; i < this.investStyleBoxes.length; i++) {
        let thisPathWidth = k * this.sizeData[i] + b;
        if (this.investStyleBoxes.length === 1)
          thisPathWidth = this.maxPathWidth;
        for (
          let j = 0;
          j < this.detailCarData[i].length &&
          tmpSum + j < this.dateData.length - 1;
          j++
        ) {
          this.svg
            .append("path")
            .attr("fill", "none")
            .attr("stroke", this.detailCarData[i][j].color)
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

.tooltip {
  position: absolute;
  text-align: center;
  max-width: 150px;
  max-height: 50px;
  padding: 6px;
  border: none;
  background: black;
  color: white;
  pointer-events: none;
  display: none;
}
</style>
