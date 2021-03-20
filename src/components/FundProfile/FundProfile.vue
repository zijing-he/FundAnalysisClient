<template>
  <div class="fund_profile" id="fund_profile">
    <div class="summary" id="summary">
      <div class="title">
        <div class="buttons-like">
          <svg
            class="icon"
            aria-hidden="true"
            @click="likeFund()"
            v-if="thisFundLikeScore <= 0"
          >
            <use xlink:href="#iconheart-line"></use>
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            @click="likeFund()"
            v-if="thisFundLikeScore > 0"
          >
            <use xlink:href="#iconheart-line-copy"></use>
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            @click="dislikeFund()"
            v-if="thisFundLikeScore >= 0"
          >
            <use xlink:href="#icondislike-line"></use>
          </svg>
          <svg
            class="icon"
            aria-hidden="true"
            @click="dislikeFund()"
            v-if="thisFundLikeScore < 0"
          >
            <use xlink:href="#icondislike-line-copy"></use>
          </svg>
        </div>
        <div style="margin-top: 4px; margin-left: 30%;">{{ fundId }}</div>
      </div>
      <div class="summary_box" v-if="!isLoading">
        <InvestStyleBox
          :boxId="fundId + '_summary'"
          :userSectors="userSectors"
          :holdingData="summaryHoldingData"
          :max_drop_downData="summaryMaxDropDownData"
          :riskData="summaryRiskData"
          :one_quarter_returnData="summaryOneQuarterData"
          :one_quarter_hs300_returnData="summaryOneQuarterHsData"
          :one_year_returnData="summaryOneYearData"
          :one_year_hs300_returnData="summaryOneYearHsData"
          :three_year_returnData="summaryThreeYearData"
          :three_year_hs300_returnData="summaryThreeYearHsData"
          :stockData="summaryStockData"
          :bondData="summaryBondData"
          :cashData="summaryCashData"
          :otherData="summaryOtherData"
          :sizeData="summarySizeData"
          :alphaData="summaryAlphaData"
          :betaData="summaryBetaData"
          :sharp_ratioData="summarySharpRatioData"
          :information_ratioData="summaryInfoRatioData"
          :boxGap="63"
          :boxWidth="120"
          :contentWidth="120"
          style="margin-top: 15px;"
        >
        </InvestStyleBox>
        <div class="buttons-turn">
          <svg class="icon" aria-hidden="true" @click="turnCounterClockwise()">
            <use xlink:href="#iconnishizhenxuanzhuan"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="turnClockwise()">
            <use xlink:href="#iconshunshizhenxuanzhuan"></use>
          </svg>
        </div>
      </div>
    </div>
    <div
      class="invest_style_boxes"
      ref="topElement"
      @scroll="topHandleScroll()"
    >
      <a-spin
        v-if="isLoading"
        size="large"
        tip="Loading..."
        style="margin: auto;"
      />
      <InvestStyleBox
        :ref="item.boxId"
        :boxId="item.boxId"
        :boxText="item.boxText"
        :userSectors="userSectors"
        :holdingData="item.holdingData"
        :max_drop_downData="item.max_drop_downData"
        :riskData="item.riskData"
        :one_quarter_returnData="item.one_quarter_returnData"
        :one_quarter_hs300_returnData="item.one_quarter_hs300_returnData"
        :one_year_returnData="item.one_year_returnData"
        :one_year_hs300_returnData="item.one_year_hs300_returnData"
        :three_year_returnData="item.three_year_returnData"
        :three_year_hs300_returnData="item.three_year_hs300_returnData"
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
      </InvestStyleBox>
    </div>
    <div
      class="curve"
      id="curve"
      ref="bottomElement"
      @scroll="bottomHandleScroll()"
    >
      <div class="tooltip" id="tooltip_path"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import InvestStyleBox from "./InvestStyleBox";
import weightKey from "@/data/weight_key.json";
import DataService from "@/utils/data-service";

export default {
  name: "FundProfile",
  props: {
    fundId: String,
    fundIds: Array, // 要计算空余部分面积，只能一起请求后端数据
    startDate: String,
    endDate: String,
    boxHeight: Number,
    fundLikeScore: Number,
    userSectors: Array,
  },
  components: {
    InvestStyleBox,
  },
  data() {
    return {
      isLoading: true,
      fundData: null,
      svg: null,
      margin: { top: 10, right: 100, bottom: 100, left: 20 },
      width: 900,
      height: 213,
      isSyncTop: false,
      isSyncBottom: false,
      dateData: [],
      detailChangeRateData: [],
      detailCarData: [],
      sizeData: [],
      investStyleBoxes: [],
      // emptyBoxes: [], // 为同步不同FundProfile的长度
      investStyleBoxWidth: (200 * this.boxHeight) / 270,
      contentWidth: (200 * this.boxHeight) / 270,
      boxGap: 200,
      thisFundLikeScore: this.fundLikeScore,
      // summary中的数据
      summaryHoldingData: undefined,
      summaryMaxDropDownData: undefined,
      summaryRiskData: undefined,
      summaryOneQuarterData: undefined,
      summaryOneQuarterHsData: undefined,
      summaryOneYearData: undefined,
      summaryOneYearHsData: undefined,
      summaryThreeYearData: undefined,
      summaryThreeYearHsData: undefined,
      summaryStockData: undefined,
      summaryBondData: undefined,
      summaryCashData: undefined,
      summaryOtherData: undefined,
      summarySizeData: undefined,
      summaryAlphaData: undefined,
      summaryBetaData: undefined,
      summarySharpRatioData: undefined,
      summaryInfoRatioData: undefined,
      eachMargin: [], // 传给气泡图
    };
  },

  // watch: {
  //   // startDate: function(val) {
  //   //   console.log("In FundProfile(startDate): ", val);
  //   // },
  //   // fundData: function(val) {
  //   //   console.log("In FundProfile(fundData): ", val);
  //   // },
  //   fundIds: function(val) {
  //     console.log("In FundProfile(fundIds): ", val);
  //     for (let i = 0; i < this.investStyleBoxes.length; i++) {
  //       this.$refs[this.investStyleBoxes[i].boxId].$forceUpdate();
  //     }
  //     this.$forceUpdate();
  //   }
  // },

  mounted: function() {
    this.isLoading = true;
    DataService.post(
      "get_view_funds",
      {
        f_ids: this.fundIds,
        start_date: this.startDate,
        end_date: this.endDate,
      },
      (data) => {
        // console.log(data);
        this.fundData = data;
        this.calcAttrs();
        this.renderInit();
        this.renderUpdate();
        this.$nextTick(() => {
          this.isLoading = false;
          this.updateMargin();
          this.updateCurve();
        });
      }
    );
  },

  // updated: function() {
  //   console.log(this.investStyleBoxes);
  //   this.updateMargin();
  //   this.updateCurve();
  // },

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
    yScale() {
      return d3
        .scaleLinear()
        .domain([-1.1, 1.1])
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
  },

  methods: {
    turnClockwise(isFatherCall = false) {
      this.svg.select(`#dashline_${this.fundId}`).remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
        this.$refs[d.boxId].turnClockwise();
      });
      if (!isFatherCall) this.$emit("turn", true, this.fundId);
    },
    turnCounterClockwise(isFatherCall = false) {
      this.svg.select(`#dashline_${this.fundId}`).remove();
      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
        this.$refs[d.boxId].turnCounterClockwise();
      });
      if (!isFatherCall) this.$emit("turn", false, this.fundId);
    },
    likeFund() {
      this.thisFundLikeScore = 1;
      // console.log(`${this.fundId}: ${this.thisFundLikeScore}`);
    },
    dislikeFund() {
      this.thisFundLikeScore = -1;
      // console.log(`${this.fundId}: ${this.thisFundLikeScore}`);
    },
    clickBar(type) {
      this.svg.select(`#dashline_${this.fundId}`).remove();
      // 这里如果用this.svg.append，有可能会加到别的FundProfile里面，具体原因未知
      const gDashline = d3
        .select(`#svg_${this.fundId}`)
        .append("g")
        .attr("id", `dashline_${this.fundId}`);

      this.investStyleBoxes.forEach((d) => {
        this.$refs[d.boxId].removeDashline();
      });

      // only consider nonnegative values
      let selectedBoxIndices = [];
      for (let i = 0; i < this.investStyleBoxes.length; i++) {
        let value = eval(
          `this.investStyleBoxes[${i}].${type}Data.norm`
        ).toFixed(2);
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
        // 坐标转换
        const startX =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i]].boxText)
          ) -
          this.investStyleBoxWidth / 2 +
          (60 * this.investStyleBoxWidth) / 200 +
          startPoint[0];
        const startY =
          5 + (20 * this.investStyleBoxWidth) / 200 + startPoint[1];
        const endX =
          this.xScale(
            new Date(this.investStyleBoxes[selectedBoxIndices[i + 1]].boxText)
          ) -
          this.investStyleBoxWidth / 2 +
          (60 * this.investStyleBoxWidth) / 200 +
          endPoint[0];
        const endY = 5 + (20 * this.investStyleBoxWidth) / 200 + endPoint[1];
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
          // 坐标转换
          if (
            [
              "one_quarter_return",
              "one_quarter_hs300_return",
              "one_year_return",
              "one_year_hs300_return",
              "three_year_return",
              "three_year_hs300_return",
              "risk",
            ].indexOf(type) !== -1
          ) {
            // top
            traverseStartX = 0;
            traverseStartY =
              traverseStartY - (20 * this.investStyleBoxWidth) / 200 - 5;
            traverseEndX = this.investStyleBoxWidth;
            traverseEndY =
              traverseEndY - (20 * this.investStyleBoxWidth) / 200 - 5;
          } else if (
            ["sharp_ratio", "information_ratio"].indexOf(type) !== -1
          ) {
            // right
            traverseStartX =
              (60 * this.investStyleBoxWidth) / 200 -
              (traverseStartY - (20 * this.investStyleBoxWidth) / 200 - 5);
            traverseStartY = 0;
            traverseEndX =
              (60 * this.investStyleBoxWidth) / 200 -
              (traverseEndY - (20 * this.investStyleBoxWidth) / 200 - 5);
            traverseEndY = this.investStyleBoxWidth;
          } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
            // bottom
            traverseStartX = this.investStyleBoxWidth;
            traverseStartY =
              (60 * this.investStyleBoxWidth) / 200 -
              (traverseStartY - (20 * this.investStyleBoxWidth) / 200 - 5);
            traverseEndX = 0;
            traverseEndY =
              (60 * this.investStyleBoxWidth) / 200 -
              (traverseEndY - (20 * this.investStyleBoxWidth) / 200 - 5);
          } else {
            // left
            traverseStartX =
              traverseStartY - (20 * this.investStyleBoxWidth) / 200 - 5;
            traverseStartY = this.investStyleBoxWidth;
            traverseEndX =
              traverseEndY - (20 * this.investStyleBoxWidth) / 200 - 5;
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
        if (
          [
            "one_quarter_return",
            "one_quarter_hs300_return",
            "one_year_return",
            "one_year_hs300_return",
            "three_year_return",
            "three_year_hs300_return",
            "risk",
          ].indexOf(type) !== -1
        ) {
          // top
          thatX1 = 0;
          thatY1 = thisY1 - (20 * this.investStyleBoxWidth) / 200 - 5;
          thatX2 = this.investStyleBoxWidth;
          thatY2 = thisY2 - (20 * this.investStyleBoxWidth) / 200 - 5;
        } else if (["sharp_ratio", "information_ratio"].indexOf(type) !== -1) {
          // right
          thatX1 =
            (60 * this.investStyleBoxWidth) / 200 -
            (thisY1 - (20 * this.investStyleBoxWidth) / 200 - 5);
          thatY1 = 0;
          thatX2 =
            (60 * this.investStyleBoxWidth) / 200 -
            (thisY2 - (20 * this.investStyleBoxWidth) / 200 - 5);
          thatY2 = this.investStyleBoxWidth;
        } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
          // bottom
          thatX1 = this.investStyleBoxWidth;
          thatY1 =
            (60 * this.investStyleBoxWidth) / 200 -
            (thisY1 - (20 * this.investStyleBoxWidth) / 200 - 5);
          thatX2 = 0;
          thatY2 =
            (60 * this.investStyleBoxWidth) / 200 -
            (thisY2 - (20 * this.investStyleBoxWidth) / 200 - 5);
        } else {
          // left
          thatX1 = thisY1 - (20 * this.investStyleBoxWidth) / 200 - 5;
          thatY1 = this.investStyleBoxWidth;
          thatX2 = thisY2 - (20 * this.investStyleBoxWidth) / 200 - 5;
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
      // 最后一个invest_style_box内的虚线需要单独处理
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
      if (
        [
          "one_quarter_return",
          "one_quarter_hs300_return",
          "one_year_return",
          "one_year_hs300_return",
          "three_year_return",
          "three_year_hs300_return",
          "risk",
        ].indexOf(type) !== -1
      ) {
        // top
        lastX = 0;
        lastY = lastTmpY - (20 * this.investStyleBoxWidth) / 200 - 5;
      } else if (["sharp_ratio", "information_ratio"].indexOf(type) !== -1) {
        // right
        lastX =
          (60 * this.investStyleBoxWidth) / 200 -
          (lastTmpY - (20 * this.investStyleBoxWidth) / 200 - 5);
        lastY = 0;
      } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
        // bottom
        lastX = this.investStyleBoxWidth;
        lastY =
          (60 * this.investStyleBoxWidth) / 200 -
          (lastTmpY - (20 * this.investStyleBoxWidth) / 200 - 5);
      } else {
        // left
        lastX = lastTmpY - (20 * this.investStyleBoxWidth) / 200 - 5;
        lastY = this.investStyleBoxWidth;
      }
      this.$refs[
        this.investStyleBoxes[selectedBoxIndices[selectedBoxIndices.length - 1]]
          .boxId
      ].drawDashline(lastX, lastY, -1, -1, false, true);
    },
    topHandleScroll() {
      // console.log(
      //   `${this.fundId} handle top`,
      //   this.$refs.topElement.scrollLeft
      // );
      this.$emit("handleScroll", this.$refs.topElement.scrollLeft);
      if (!this.isSyncTop) {
        this.isSyncBottom = true;
        this.$refs.bottomElement.scrollLeft = this.$refs.topElement.scrollLeft;
      }
      this.isSyncTop = false;
    },
    bottomHandleScroll() {
      // console.log(
      //   `${this.fundId} handle bottom`,
      //   this.$refs.bottomElement.scrollLeft
      // );
      this.$emit("handleScroll", this.$refs.bottomElement.scrollLeft);
      if (!this.isSyncBottom) {
        this.isSyncTop = true;
        this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft;
      }
      this.isSyncBottom = false;
    },
    handleScroll(value) {
      // console.log(`${this.fundId} notify to scroll`, value);
      this.$refs.topElement.scrollLeft = this.$refs.bottomElement.scrollLeft = value;
    },
    calcAttrs() {
      for (let i in this.fundData["detail"][this.fundId]) {
        // if (Object.keys(this.fundData["detail"][this.fundId][i]).length === 0) {
        //   this.emptyBoxes.push(i);
        //   continue;
        // }
        let tmpDetailCarData = this.fundData["detail"][this.fundId][i][
          "detail_car"
        ];
        let tmpDetailChangeRateData = this.fundData["detail"][this.fundId][i][
          "detail_change_rate"
        ];
        let tmpDateData = Object.keys(tmpDetailCarData);
        tmpDateData = tmpDateData.map(
          (d) => `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6)}`
        );
        // this.sizeData.push(
        //   this.fundData["detail"][this.fundId][i]["size"].norm
        // );
        this.dateData = [...this.dateData, ...tmpDateData];
        this.detailChangeRateData.push(Object.values(tmpDetailChangeRateData));
        this.detailCarData.push(Object.values(tmpDetailCarData));
        let holdingData = this.fundData["detail"][this.fundId][i]["holding"];
        let holdingDataKeys = Object.keys(holdingData).sort(
          (a, b) => holdingData[b] - holdingData[a]
        );
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
          boxId:
            this.fundId +
            "_" +
            `${i.substring(0, 4)}-${i.substring(4, 6)}-${i.substring(6)}`,
          boxText: `${i.substring(0, 4)}-${i.substring(4, 6)}-${i.substring(
            6
          )}`,
          holdingData: thisHoldingData,
          one_quarter_returnData:
            "one_quarter_return" in this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i]["one_quarter_return"]
              : undefined,
          one_quarter_hs300_returnData:
            "one_quarter_hs300_return" in
            this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i][
                  "one_quarter_hs300_return"
                ]
              : undefined,
          one_year_returnData:
            "one_year_return" in this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i]["one_year_return"]
              : undefined,
          one_year_hs300_returnData:
            "one_year_hs300_return" in this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i]["one_year_hs300_return"]
              : undefined,
          three_year_returnData:
            "three_year_return" in this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i]["three_year_return"]
              : undefined,
          three_year_hs300_returnData:
            "three_year_hs300_return" in this.fundData["detail"][this.fundId][i]
              ? this.fundData["detail"][this.fundId][i][
                  "three_year_hs300_return"
                ]
              : undefined,
          max_drop_downData: this.fundData["detail"][this.fundId][i][
            "max_drop_down"
          ],
          riskData: this.fundData["detail"][this.fundId][i]["risk"],
          stockData: this.fundData["detail"][this.fundId][i]["stock"],
          bondData: this.fundData["detail"][this.fundId][i]["bond"],
          cashData: this.fundData["detail"][this.fundId][i]["cash"],
          otherData: this.fundData["detail"][this.fundId][i]["other"],
          sizeData: this.fundData["detail"][this.fundId][i]["size"],
          alphaData: this.fundData["detail"][this.fundId][i]["alpha"],
          betaData: this.fundData["detail"][this.fundId][i]["beta"],
          sharp_ratioData: this.fundData["detail"][this.fundId][i][
            "sharp_ratio"
          ],
          information_ratioData: this.fundData["detail"][this.fundId][i][
            "information_ratio"
          ],
        });
      }

      // summary中的数据
      let sumHoldingData = this.fundData["total"][this.fundId][
        "holding_values"
      ];
      let sumHoldingDataKeys = Object.keys(sumHoldingData)
        .sort((a, b) => sumHoldingData[b] - sumHoldingData[a])
        .slice(0, 10);
      let thisSumHoldingData = [];
      sumHoldingDataKeys.forEach((d) => {
        thisSumHoldingData.push({
          name: d,
          value: sumHoldingData[d],
        });
      });
      thisSumHoldingData = {
        name: "all",
        children: thisSumHoldingData,
      };
      this.summaryHoldingData = thisSumHoldingData;
      this.summaryMaxDropDownData = this.fundData["total"][this.fundId][
        "max_drop_down"
      ];
      this.summaryRiskData = this.fundData["total"][this.fundId]["risk"];
      this.summaryStockData = this.fundData["total"][this.fundId]["stock"];
      this.summaryBondData = this.fundData["total"][this.fundId]["bond"];
      this.summaryCashData = this.fundData["total"][this.fundId]["cash"];
      this.summaryOtherData = this.fundData["total"][this.fundId]["other"];
      this.summarySizeData = this.fundData["total"][this.fundId]["size"];
      this.summaryAlphaData = this.fundData["total"][this.fundId]["alpha"];
      this.summaryBetaData = this.fundData["total"][this.fundId]["beta"];
      this.summarySharpRatioData = this.fundData["total"][this.fundId][
        "sharp_ratio"
      ];
      this.summaryInfoRatioData = this.fundData["total"][this.fundId][
        "information_ratio"
      ];
      this.summaryOneQuarterData =
        "one_quarter_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["one_quarter_return"]
          : undefined;
      this.summaryOneQuarterHsData =
        "one_quarter_hs300_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["one_quarter_hs300_return"]
          : undefined;
      this.summaryOneYearData =
        "one_year_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["one_year_return"]
          : undefined;
      this.summaryOneYearHsData =
        "one_year_hs300_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["one_year_hs300_return"]
          : undefined;
      this.summaryThreeYearData =
        "three_year_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["three_year_return"]
          : undefined;
      this.summaryThreeYearHsData =
        "three_year_hs300_return" in this.fundData["total"][this.fundId]
          ? this.fundData["total"][this.fundId]["three_year_hs300_return"]
          : undefined;
    },
    renderInit() {
      this.margin.left = this.margin.right = this.investStyleBoxWidth / 2;
      this.width = Math.max(
        (this.investStyleBoxWidth + this.boxGap) *
          this.investStyleBoxes.length +
          this.margin.left +
          this.margin.right -
          this.investStyleBoxWidth / 2,
        this.width
      );
      // 将实际宽度传递给父组件进行同步
      this.$emit("updateWidth", this.width);
      this.height = this.boxHeight;
      this.margin.top = this.margin.bottom = this.height / 4;
      // this.maxPathWidth = (60 * this.investStyleBoxWidth) / 200;
      // this.minPathWidth = this.maxPathWidth / 2;
      d3.select("#fund_profile")
        .attr("id", `fund_profile_${this.fundId}`)
        .style("height", this.height + "px");
      d3.select("#summary").attr("id", `summary_${this.fundId}`);
      d3.select("#curve").attr("id", `curve_${this.fundId}`);
      d3.select("#tooltip_path").attr("id", `tooltip_path_${this.fundId}`);
      this.svg = d3
        .select(`#curve_${this.fundId}`)
        .append("svg")
        .attr("id", `svg_${this.fundId}`)
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);
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
        .attr(
          "transform",
          `translate(0, ${this.height - (15 * this.investStyleBoxWidth) / 200})`
        )
        .call(xAxis);
    },
    updateMargin() {
      this.eachMargin = [];
      d3.select(`#invest_style_box_${this.investStyleBoxes[0].boxId}`).style(
        "margin-left",
        this.xScale(new Date(this.investStyleBoxes[0].boxText)) -
          this.investStyleBoxWidth / 2 +
          "px"
      );
      this.eachMargin.push(
        this.xScale(new Date(this.investStyleBoxes[0].boxText)) -
          this.investStyleBoxWidth / 2
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
        this.eachMargin.push(
          this.xScale(new Date(this.investStyleBoxes[i].boxText)) -
            this.investStyleBoxWidth / 2 -
            (lastPos + this.investStyleBoxWidth / 2)
        );
        lastPos = this.xScale(new Date(this.investStyleBoxes[i].boxText));
      }
      this.$emit("updateMargin", this.eachMargin);
    },
    updateCurve() {
      let tmpSum = 0;
      let that = this;
      for (let i = 0; i < this.investStyleBoxes.length; i++) {
        for (
          let j = 0;
          j < this.detailChangeRateData[i].length - 1 &&
          tmpSum + j < this.dateData.length - 1;
          j++
        ) {
          let key = this.dateData[tmpSum + j];
          let value = this.detailChangeRateData[i][j].value.toFixed(4);
          this.svg
            .append("path")
            .attr("fill", "none")
            .attr("stroke", this.detailCarData[i][j].color)
            .attr("stroke-width", 8)
            .attr(
              "d",
              `M ${this.xScale(
                new Date(this.dateData[tmpSum + j])
              )} ${this.yScale(this.detailChangeRateData[i][j].norm)}
              L ${this.xScale(
                new Date(this.dateData[tmpSum + j + 1])
              )} ${this.yScale(this.detailChangeRateData[i][j + 1].norm)}`
            )
            .on("mouseover", function() {
              d3.select(`#tooltip_path_${that.fundId}`).style(
                "display",
                "block"
              );
            })
            .on("mousemove", function(e) {
              let offsetX = e.offsetX - 42.5;
              if (
                e.offsetX + 42.5 >
                that.xScale(new Date(that.investStyleBoxes[i].boxText)) -
                  that.investStyleBoxWidth / 2
              )
                offsetX -= 45;
              if (
                i !== 0 &&
                e.offsetX - 42.5 <
                  that.xScale(new Date(that.investStyleBoxes[i - 1].boxText)) +
                    that.investStyleBoxWidth / 2
              )
                offsetX += 45;
              d3.select(`#tooltip_path_${that.fundId}`)
                .html(key + "<br>" + value)
                .style("width", "85px")
                .style("left", offsetX + "px")
                .style("top", e.offsetY + 15 + "px");
            })
            .on("mouseout", function() {
              d3.select(`#tooltip_path_${that.fundId}`).style(
                "display",
                "none"
              );
            });
        }
        tmpSum += this.detailChangeRateData[i].length;
      }
      // 添加基准虚线
      this.svg
        .append("path")
        .attr("stroke-dasharray", "2, 2")
        .attr("stroke", "#979797")
        .attr(
          "d",
          `M ${this.margin.left} ${this.height / 2} H ${this.width -
            this.margin.right}`
        );
    },
  },
};
</script>

<style scoped>
.fund_profile {
  position: relative;
  height: 213px;
  width: calc(100% - 30px);
  background: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 20px 20px 0;
}

.summary {
  position: absolute;
  height: 100%;
  width: 15%;
}

.summary .title {
  display: flex;
  height: 35px;
  width: 80%;
  margin-left: 10%;
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 19px;
}

.buttons-like {
  margin-top: 5px;
  margin-left: 5px;
  justify-content: space-around;
}

.buttons-turn {
  position: absolute;
  left: 215px;
  top: 70px;
  font-size: 27px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
}

.invest_style_boxes {
  position: absolute;
  display: flex;
  height: 100%;
  width: 85%;
  left: 15%;
  border-left: 1px dashed #979797;
  overflow-x: auto;
  overflow-y: hidden;
}

.curve {
  position: absolute;
  height: 100%;
  width: 85%;
  left: 15%;
  border-left: 1px dashed #979797;
  z-index: 2;
  overflow-x: auto;
  overflow-y: hidden;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  height: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

.invest_style_boxes::-webkit-scrollbar {
  display: none;
}

.tooltip {
  position: absolute;
  text-align: center;
  max-width: 150px;
  max-height: 300px;
  padding: 6px;
  border: none;
  background: black;
  color: white;
  pointer-events: none;
  display: none;
  font-size: 10px;
}
</style>
