<template>
  <div id="invest_style_box" class="invest_style_box">
    <div class="text" id="text" v-if="boxText !== undefined">{{ boxText }}</div>
    <div class="content" id="content">
      <div class="center" id="center"></div>
      <div class="left" id="left"></div>
      <div class="top" id="top"></div>
      <div class="right" id="right"></div>
      <div class="bottom" id="bottom"></div>
      <div class="tooltip" id="tooltip"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import sectorDict from "@/data/sector_dict.json";
import weightKey from "@/data/weight_key.json";

const colorMap = {
  // performance
  one_quarter_return: "rgb(167, 183, 220)",
  one_year_return: "rgb(167, 183, 220)",
  three_year_return: "rgb(167, 183, 220)",
  one_quarter_hs300_return: "rgb(167, 183, 220)",
  one_year_hs300_return: "rgb(167, 183, 220)",
  three_year_hs300_return: "rgb(167, 183, 220)",
  // risk
  risk: "rgb(211, 165, 154)",
  max_drop_down: "rgb(211, 165, 154)",
  sharp_ratio: "rgb(211, 165, 154)",
  beta: "rgb(211, 165, 154)",
  // abnormal performance
  information_ratio: "rgb(221, 194, 236)",
  alpha: "rgb(221, 194, 236)",
  // basic
  size: "rgb(236, 122, 75)",
  stock: "rgb(236, 122, 75)",
  bond: "rgb(236, 122, 75)",
  cash: "rgb(236, 122, 75)",
  other: "rgb(236, 122, 75)",
};

// 柱状图的起始x和宽度，根据每条边有多少根柱子而定 (以边长为80确定，后根据实际边长调整)
const barAttrs = {
  one: {
    startX: [20],
    width: 40,
  },
  two: {
    startX: [7, 43],
    width: 30,
  },
  three: {
    startX: [4, 30, 56],
    width: 20,
  },
  four: {
    startX: [4, 23, 42, 61],
    width: 15,
  },
  five: {
    startX: [4, 19, 34, 49, 64],
    width: 12,
  },
  // 顶部需要特殊处理下
  two_top: {
    startX: [20, 40],
    width: 20,
  },
  four_top: {
    startX: [7, 22, 43, 58],
    width: 15,
  },
  six_top: {
    startX: [4, 14, 30, 40, 56, 66],
    width: 10,
  },
};

export default {
  name: "InvestStyleBox",
  props: {
    boxId: String,
    boxText: String,
    userSectors: Array,
    holdingData: Object,
    max_drop_downData: Object,
    one_quarter_returnData: Object,
    one_quarter_hs300_returnData: Object,
    one_year_returnData: Object,
    one_year_hs300_returnData: Object,
    three_year_returnData: Object,
    three_year_hs300_returnData: Object,
    riskData: Object,
    stockData: Object,
    bondData: Object,
    cashData: Object,
    otherData: Object,
    sizeData: Object,
    alphaData: Object,
    betaData: Object,
    sharp_ratioData: Object,
    information_ratioData: Object,
    boxWidth: Number,
    contentWidth: Number,
    boxGap: Number,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      width: 200,
      height: 200,
      // version 4
      centerSvg: null,
      leftSvg: null,
      topSvg: null,
      rightSvg: null,
      bottomSvg: null,
      initBottomBars: ["sharp_ratio", "information_ratio", "alpha"],
      initLeftBars: ["size", "stock", "bond", "cash", "other"],
      initRightBars: ["risk", "max_drop_down", "beta"],
      barTopMargin: 5,
      curDegree: 0,
      lastTopBars: [],
      midPointX: 0,
      midPointY: 0,
    };
  },

  watch: {
    userSectors(val) {
      if (val) this.updateTreemapColors();
    },
  },

  mounted: function() {
    // console.log(this.$props);
    this.renderInit();
    this.renderUpdate();
  },

  computed: {
    treemap() {
      return d3
        .treemap()
        .tile(d3.treemapSquarify)
        .size([(80 * this.boxWidth) / 200, (80 * this.boxWidth) / 200])
        .padding(1)
        .round(true);
    },
    yScale() {
      return d3.scaleLinear();
    },
    initTopBars() {
      // quarter, year, 3-year 有些可能为空，确定下具体有几个
      let tmp = [];
      if (this.one_quarter_returnData !== undefined) {
        tmp.push("one_quarter_return");
        tmp.push("one_quarter_hs300_return");
      }
      if (this.one_year_returnData !== undefined) {
        tmp.push("one_year_return");
        tmp.push("one_year_hs300_return");
      }
      if (this.three_year_returnData !== undefined) {
        tmp.push("three_year_return");
        tmp.push("three_year_hs300_return");
      }
      return tmp;
    },
    curTopBars() {
      if (this.curDegree % 360 === 0) {
        return this.initTopBars;
      } else if (this.curDegree % 360 === 90 || this.curDegree % 360 === -270) {
        return this.initLeftBars;
      } else if (
        this.curDegree % 360 === 180 ||
        this.curDegree % 360 === -180
      ) {
        return this.initBottomBars;
      } else {
        return this.initRightBars;
      }
    },
    curTopSide() {
      if (this.curDegree % 360 === 0) {
        return "top";
      } else if (this.curDegree % 360 === 90 || this.curDegree % 360 === -270) {
        return "left";
      } else if (
        this.curDegree % 360 === 180 ||
        this.curDegree % 360 === -180
      ) {
        return "bottom";
      } else {
        return "right";
      }
    },
  },

  methods: {
    renderInit() {
      d3.select("#invest_style_box")
        .attr("id", "invest_style_box_" + this.boxId)
        .style("width", this.boxWidth + "px")
        .style(
          "height",
          this.boxText !== undefined
            ? (220 * this.boxWidth) / 200 + "px"
            : this.boxWidth + "px"
        )
        .style("margin-left", this.boxGap + "px");
      d3.select("#text")
        .attr("id", "text_" + this.boxId)
        .style("width", this.contentWidth + "px")
        .style("height", (20 * this.boxWidth) / 200 + "px");
      d3.select("#content")
        .attr("id", "content_" + this.boxId)
        .style("width", this.contentWidth + "px")
        .style("height", this.contentWidth + "px")
        .style("top", (20 * this.boxWidth) / 200 + "px");
      d3.select("#center")
        .attr("id", "center_" + this.boxId)
        .style("width", (80 * this.boxWidth) / 200 + "px")
        .style("height", (80 * this.boxWidth) / 200 + "px")
        .style("left", (60 * this.boxWidth) / 200 + "px")
        .style("top", (60 * this.boxWidth) / 200 + "px");
      d3.select("#left")
        .attr("id", "left_" + this.boxId)
        .style("width", (60 * this.boxWidth) / 200 + "px")
        .style("height", this.boxWidth + "px");
      d3.select("#top")
        .attr("id", "top_" + this.boxId)
        .style("height", (60 * this.boxWidth) / 200 + "px")
        .style("width", this.boxWidth + "px");
      d3.select("#right")
        .attr("id", "right_" + this.boxId)
        .style("width", (60 * this.boxWidth) / 200 + "px")
        .style("height", this.boxWidth + "px")
        .style("left", (140 * this.boxWidth) / 200 + "px");
      d3.select("#bottom")
        .attr("id", "bottom_" + this.boxId)
        .style("width", this.boxWidth + "px")
        .style("height", (60 * this.boxWidth) / 200 + "px")
        .style("top", (140 * this.boxWidth) / 200 + "px");
      d3.select("#tooltip").attr("id", "tooltip_" + this.boxId);
      d3.select("#icons").attr("id", "icons_" + this.boxId);
      this.centerSvg = d3
        .select("#center_" + this.boxId)
        .append("svg")
        .attr("width", (80 * this.boxWidth) / 200)
        .attr("height", (80 * this.boxWidth) / 200)
        .attr("viewBox", [
          0,
          0,
          (80 * this.boxWidth) / 200,
          (80 * this.boxWidth) / 200,
        ]);
      this.leftSvg = d3
        .select("#left_" + this.boxId)
        .append("svg")
        .attr("width", (60 * this.boxWidth) / 200)
        .attr("height", this.boxWidth)
        .attr("viewBox", [0, 0, (60 * this.boxWidth) / 200, this.boxWidth]);
      this.topSvg = d3
        .select("#top_" + this.boxId)
        .append("svg")
        .attr("width", this.boxWidth)
        .attr("height", (60 * this.boxWidth) / 200)
        .attr("viewBox", [0, 0, this.boxWidth, (60 * this.boxWidth) / 200]);
      this.rightSvg = d3
        .select("#right_" + this.boxId)
        .append("svg")
        .attr("width", (60 * this.boxWidth) / 200)
        .attr("height", this.boxWidth)
        .attr("viewBox", [0, 0, (60 * this.boxWidth) / 200, this.boxWidth]);
      this.bottomSvg = d3
        .select("#bottom_" + this.boxId)
        .append("svg")
        .attr("width", this.boxWidth)
        .attr("height", (60 * this.boxWidth) / 200)
        .attr("viewBox", [0, 0, this.boxWidth, (60 * this.boxWidth) / 200]);
    },
    renderUpdate() {
      // treemap
      this.updateTreemapColors();

      // bars
      let that = this;
      // top
      this.yScale
        .range([(60 * this.boxWidth) / 200, this.barTopMargin])
        .domain([0, 1.1]);
      // 条纹，下同
      const topDefs = this.topSvg.append("defs");
      topDefs
        .append("pattern")
        .attr("id", `top_pattern_stripe_${this.boxId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      topDefs
        .append("mask")
        .attr("id", `top_mask_stripe_${this.boxId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#top_pattern_stripe_${this.boxId})`)
        .attr("stroke", "black");
      const gRectsTop = this.topSvg
        .append("g")
        .attr("transform", `translate(${(60 * this.boxWidth) / 200}, 0)`);
      // const returnToHs300 = {
      //   one_quarter_return: this.one_quarter_hs300_returnData,
      //   one_year_return: this.one_year_hs300_returnData,
      //   three_year_return: this.three_year_hs300_returnData,
      // };
      // if (this.initTopBars.length === 1) {
      //   gRectsTop
      //     .append("rect")
      //     .attr("id", `risk-${this.boxId}`)
      //     .attr("fill", colorMap.risk)
      //     .attr("stroke", colorMap.risk)
      //     .attr(
      //       "mask",
      //       this.riskData.norm < 0
      //         ? `url(#top_mask_stripe_${this.boxId})`
      //         : "none"
      //     )
      //     .attr("x", (barAttrs.one.startX[0] * this.boxWidth) / 200)
      //     .attr("y", this.yScale(Math.abs(this.riskData.norm)))
      //     .attr("width", (barAttrs.one.width * this.boxWidth) / 200)
      //     .attr(
      //       "height",
      //       this.yScale(0) - this.yScale(Math.abs(this.riskData.norm))
      //     );
      // } else
      if (this.initTopBars.length === 2) {
        for (let i = 0; i < this.initTopBars.length; i++) {
          gRectsTop
            .append("rect")
            .attr("id", `${this.initTopBars[i]}-${this.boxId}`)
            .attr("fill", eval(`colorMap.${this.initTopBars[i]}`))
            .attr("stroke-dasharray", i % 2 === 0 ? "none" : "2, 2")
            .attr("stroke", "black")
            .attr(
              "mask",
              eval(`this.${this.initTopBars[i]}Data.norm`) < 0
                ? `url(#top_mask_stripe_${this.boxId})`
                : "none"
            )
            .attr("x", (barAttrs.two_top.startX[i] * this.boxWidth) / 200)
            .attr(
              "y",
              this.yScale(
                Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
              )
            )
            .attr("width", (barAttrs.two_top.width * this.boxWidth) / 200)
            .attr(
              "height",
              this.yScale(0) -
                this.yScale(
                  Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
                )
            );
          // 使用mask会导致边框变虚线，用实线描一遍
          if (i % 2 === 0 && eval(`this.${this.initTopBars[i]}Data.norm`) < 0) {
            let dom = d3.select(`#${this.initTopBars[i]}-${this.boxId}`);
            let x = parseFloat(dom.attr("x")),
              y = parseFloat(dom.attr("y")),
              width = parseFloat(dom.attr("width")),
              height = parseFloat(dom.attr("height"));
            gRectsTop
              .append("path")
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr(
                "d",
                `M ${x} ${y + height} v ${-height} h ${width} v ${height} Z`
              );
          }
          // 最新设计不画虚线了
          // 根据return和hs300的差值画虚线
          // if (i > 0 && i < this.initTopBars.length - 1) {
          //   if (
          //     Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`)) >
          //     Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //   ) {
          //     gRectsTop
          //       .append("path")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr(
          //         "d",
          //         `m ${(barAttrs.two.startX[i] * this.boxWidth) /
          //           200} ${this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )} h ${(barAttrs.two.width * this.boxWidth) / 200}`
          //       );
          //   } else {
          //     gRectsTop
          //       .append("rect")
          //       .attr("fill", "none")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr("x", (barAttrs.two.startX[i] * this.boxWidth) / 200)
          //       .attr(
          //         "y",
          //         this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )
          //       )
          //       .attr("width", (barAttrs.two.width * this.boxWidth) / 200)
          //       .attr(
          //         "height",
          //         this.yScale(
          //           Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
          //         ) -
          //           this.yScale(
          //             Math.abs(
          //               eval(`returnToHs300.${this.initTopBars[i]}.norm`)
          //             )
          //           )
          //       );
          //   }
          // }
        }
      } else if (this.initTopBars.length === 4) {
        for (let i = 0; i < this.initTopBars.length; i++) {
          gRectsTop
            .append("rect")
            .attr("id", `${this.initTopBars[i]}-${this.boxId}`)
            .attr("fill", eval(`colorMap.${this.initTopBars[i]}`))
            .attr("stroke-dasharray", i % 2 === 0 ? "none" : "2, 2")
            .attr("stroke", "black")
            .attr(
              "mask",
              eval(`this.${this.initTopBars[i]}Data.norm`) < 0
                ? `url(#top_mask_stripe_${this.boxId})`
                : "none"
            )
            .attr("x", (barAttrs.four_top.startX[i] * this.boxWidth) / 200)
            .attr(
              "y",
              this.yScale(
                Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
              )
            )
            .attr("width", (barAttrs.four_top.width * this.boxWidth) / 200)
            .attr(
              "height",
              this.yScale(0) -
                this.yScale(
                  Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
                )
            );
          if (i % 2 === 0 && eval(`this.${this.initTopBars[i]}Data.norm`) < 0) {
            let dom = d3.select(`#${this.initTopBars[i]}-${this.boxId}`);
            let x = parseFloat(dom.attr("x")),
              y = parseFloat(dom.attr("y")),
              width = parseFloat(dom.attr("width")),
              height = parseFloat(dom.attr("height"));
            gRectsTop
              .append("path")
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr(
                "d",
                `M ${x} ${y + height} v ${-height} h ${width} v ${height} Z`
              );
          }
          // 根据return和hs300的差值画虚线
          // if (i > 0 && i < this.initTopBars.length - 1) {
          //   if (
          //     Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`)) >
          //     Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //   ) {
          //     gRectsTop
          //       .append("path")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr(
          //         "d",
          //         `m ${(barAttrs.three.startX[i] * this.boxWidth) /
          //           200} ${this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )} h ${(barAttrs.three.width * this.boxWidth) / 200}`
          //       );
          //   } else {
          //     gRectsTop
          //       .append("rect")
          //       .attr("fill", "none")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr("x", (barAttrs.three.startX[i] * this.boxWidth) / 200)
          //       .attr(
          //         "y",
          //         this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )
          //       )
          //       .attr("width", (barAttrs.three.width * this.boxWidth) / 200)
          //       .attr(
          //         "height",
          //         this.yScale(
          //           Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
          //         ) -
          //           this.yScale(
          //             Math.abs(
          //               eval(`returnToHs300.${this.initTopBars[i]}.norm`)
          //             )
          //           )
          //       );
          //   }
          // }
        }
      } else {
        for (let i = 0; i < this.initTopBars.length; i++) {
          gRectsTop
            .append("rect")
            .attr("id", `${this.initTopBars[i]}-${this.boxId}`)
            .attr("fill", eval(`colorMap.${this.initTopBars[i]}`))
            .attr("stroke-dasharray", i % 2 === 0 ? "none" : "2, 2")
            .attr("stroke", "black")
            .attr(
              "mask",
              eval(`this.${this.initTopBars[i]}Data.norm`) < 0
                ? `url(#top_mask_stripe_${this.boxId})`
                : "none"
            )
            .attr("x", (barAttrs.six_top.startX[i] * this.boxWidth) / 200)
            .attr(
              "y",
              this.yScale(
                Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
              )
            )
            .attr("width", (barAttrs.six_top.width * this.boxWidth) / 200)
            .attr(
              "height",
              this.yScale(0) -
                this.yScale(
                  Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
                )
            );
          if (i % 2 === 0 && eval(`this.${this.initTopBars[i]}Data.norm`) < 0) {
            let dom = d3.select(`#${this.initTopBars[i]}-${this.boxId}`);
            let x = parseFloat(dom.attr("x")),
              y = parseFloat(dom.attr("y")),
              width = parseFloat(dom.attr("width")),
              height = parseFloat(dom.attr("height"));
            gRectsTop
              .append("path")
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr(
                "d",
                `M ${x} ${y + height} v ${-height} h ${width} v ${height} Z`
              );
          }
          // 根据return和hs300的差值画虚线
          // if (i > 0 && i < this.initTopBars.length - 1) {
          //   if (
          //     Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`)) >
          //     Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //   ) {
          //     gRectsTop
          //       .append("path")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr(
          //         "d",
          //         `m ${(barAttrs.four.startX[i] * this.boxWidth) /
          //           200} ${this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )} h ${(barAttrs.four.width * this.boxWidth) / 200}`
          //       );
          //   } else {
          //     gRectsTop
          //       .append("rect")
          //       .attr("fill", "none")
          //       .attr("stroke-dasharray", "2, 2")
          //       .attr("stroke", "black")
          //       .attr("x", (barAttrs.four.startX[i] * this.boxWidth) / 200)
          //       .attr(
          //         "y",
          //         this.yScale(
          //           Math.abs(eval(`returnToHs300.${this.initTopBars[i]}.norm`))
          //         )
          //       )
          //       .attr("width", (barAttrs.four.width * this.boxWidth) / 200)
          //       .attr(
          //         "height",
          //         this.yScale(
          //           Math.abs(eval(`this.${this.initTopBars[i]}Data.norm`))
          //         ) -
          //           this.yScale(
          //             Math.abs(
          //               eval(`returnToHs300.${this.initTopBars[i]}.norm`)
          //             )
          //           )
          //       );
          //   }
          // }
        }
      }

      // right
      this.yScale
        .range([0, ((60 - this.barTopMargin) * this.boxWidth) / 200])
        .domain([0, 1.1]);
      const rightDefs = this.rightSvg.append("defs");
      rightDefs
        .append("pattern")
        .attr("id", `right_pattern_stripe_${this.boxId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      rightDefs
        .append("mask")
        .attr("id", `right_mask_stripe_${this.boxId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#right_pattern_stripe_${this.boxId})`);
      const gRectsRight = this.rightSvg
        .append("g")
        .attr("transform", `translate(0, ${(60 * this.boxWidth) / 200})`);
      for (let i = 0; i < this.initRightBars.length; i++) {
        gRectsRight
          .append("rect")
          .attr("id", `${this.initRightBars[i]}-${this.boxId}`)
          .attr("fill", eval(`colorMap.${this.initRightBars[i]}`))
          .attr("stroke", "black")
          .attr(
            "mask",
            eval(`this.${this.initRightBars[i]}Data.norm`) < 0
              ? `url(#right_mask_stripe_${this.boxId})`
              : "none"
          )
          .attr("x", 0)
          .attr("y", (barAttrs.three.startX[i] * this.boxWidth) / 200)
          .attr(
            "width",
            this.yScale(
              Math.abs(eval(`this.${this.initRightBars[i]}Data.norm`))
            ) - this.yScale(0)
          )
          .attr("height", (barAttrs.three.width * this.boxWidth) / 200);
        if (eval(`this.${this.initRightBars[i]}Data.norm`) < 0) {
          let dom = d3.select(`#${this.initRightBars[i]}-${this.boxId}`);
          let x = parseFloat(dom.attr("x")),
            y = parseFloat(dom.attr("y")),
            width = parseFloat(dom.attr("width")),
            height = parseFloat(dom.attr("height"));
          gRectsRight
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", `M 0 ${y} h ${width} v ${height} h ${-width} Z`);
        }
      }

      // bottom
      this.yScale
        .range([0, ((60 - this.barTopMargin) * this.boxWidth) / 200])
        .domain([0, 1.1]);
      const bottomDefs = this.bottomSvg.append("defs");
      bottomDefs
        .append("pattern")
        .attr("id", `bottom_pattern_stripe_${this.boxId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      bottomDefs
        .append("mask")
        .attr("id", `bottom_mask_stripe_${this.boxId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#bottom_pattern_stripe_${this.boxId})`);
      const gRectsBottom = this.bottomSvg
        .append("g")
        .attr("transform", `translate(${(60 * this.boxWidth) / 200}, 0)`);
      for (let i = 0; i < this.initBottomBars.length; i++) {
        gRectsBottom
          .append("rect")
          .attr("id", `${this.initBottomBars[i]}-${this.boxId}`)
          .attr("fill", eval(`colorMap.${this.initBottomBars[i]}`))
          .attr("stroke", "black")
          .attr(
            "mask",
            eval(`this.${this.initBottomBars[i]}Data.norm`) < 0
              ? `url(#bottom_mask_stripe_${this.boxId})`
              : "none"
          )
          .attr("x", (barAttrs.three.startX[i] * this.boxWidth) / 200)
          .attr("y", 0)
          .attr("width", (barAttrs.three.width * this.boxWidth) / 200)
          .attr(
            "height",
            this.yScale(
              Math.abs(eval(`this.${this.initBottomBars[i]}Data.norm`))
            ) - this.yScale(0)
          );
        if (eval(`this.${this.initBottomBars[i]}Data.norm`) < 0) {
          let dom = d3.select(`#${this.initBottomBars[i]}-${this.boxId}`);
          let x = parseFloat(dom.attr("x")),
            y = parseFloat(dom.attr("y")),
            width = parseFloat(dom.attr("width")),
            height = parseFloat(dom.attr("height"));
          gRectsBottom
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", `M ${x} 0 h ${width} v ${height} h ${-width} Z`);
        }
      }

      // left
      this.yScale
        .range([
          (60 * this.boxWidth) / 200,
          (this.barTopMargin * this.boxWidth) / 200,
        ])
        .domain([0, 1.1]);
      const leftDefs = this.leftSvg.append("defs");
      leftDefs
        .append("pattern")
        .attr("id", `left_pattern_stripe_${this.boxId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      leftDefs
        .append("mask")
        .attr("id", `left_mask_stripe_${this.boxId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#left_pattern_stripe_${this.boxId})`);
      const gRectsLeft = this.leftSvg
        .append("g")
        .attr("transform", `translate(0, ${(60 * this.boxWidth) / 200})`);
      // for (let i = 0; i < this.initLeftBars.length; i++) {
      //   gRectsLeft
      //     .append("rect")
      //     .attr("id", `${this.initLeftBars[i]}-${this.boxId}`)
      //     .attr("fill", eval(`colorMap.${this.initLeftBars[i]}`))
      //     .attr("stroke", "black")
      //     .attr(
      //       "mask",
      //       eval(`this.${this.initLeftBars[i]}Data.norm`) < 0
      //         ? `url(#left_mask_stripe_${this.boxId})`
      //         : "none"
      //     )
      //     .attr(
      //       "x",
      //       this.yScale(Math.abs(eval(`this.${this.initLeftBars[i]}Data.norm`)))
      //     )
      //     .attr("y", (barAttrs.four.startX[i] * this.boxWidth) / 200)
      //     .attr(
      //       "width",
      //       this.yScale(0) -
      //         this.yScale(
      //           Math.abs(eval(`this.${this.initLeftBars[i]}Data.norm`))
      //         )
      //     )
      //     .attr("height", (barAttrs.four.width * this.boxWidth) / 200);
      //   if (eval(`this.${this.initLeftBars[i]}Data.norm`) < 0) {
      //     let dom = d3.select(`#${this.initLeftBars[i]}-${this.boxId}`);
      //     let x = parseFloat(dom.attr("x")),
      //       y = parseFloat(dom.attr("y")),
      //       width = parseFloat(dom.attr("width")),
      //       height = parseFloat(dom.attr("height"));
      //     gRectsLeft
      //       .append("path")
      //       .attr("fill", "none")
      //       .attr("stroke", "black")
      //       .attr("d", `M ${x} ${y} h ${width} v ${height} h ${-width} Z`);
      //   }
      // }
      gRectsLeft
        .append("rect")
        .attr("id", `size-${this.boxId}`)
        .attr("fill", colorMap.size)
        .attr("stroke", "black")
        .attr(
          "mask",
          this.sizeData.norm < 0
            ? `url(#left_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", this.yScale(Math.abs(this.sizeData.norm)))
        .attr("y", (barAttrs.two.startX[0] * this.boxWidth) / 200)
        .attr(
          "width",
          this.yScale(0) - this.yScale(Math.abs(this.sizeData.norm))
        )
        .attr("height", (barAttrs.two.width * this.boxWidth) / 200);
      if (this.sizeData.norm < 0) {
        let dom = d3.select(`#size-${this.boxId}`);
        let x = parseFloat(dom.attr("x")),
          y = parseFloat(dom.attr("y")),
          width = parseFloat(dom.attr("width")),
          height = parseFloat(dom.attr("height"));
        gRectsLeft
          .append("path")
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("d", `M ${x} ${y} h ${width} v ${height} h ${-width} Z`);
      }
      // 资产分布改成堆叠图
      this.yScale.domain([0, 1]);
      let curTotalWidth = 0;
      for (let i = 1; i < this.initLeftBars.length; i++) {
        let curX = this.yScale(
          Math.abs(eval(`this.${this.initLeftBars[i]}Data.norm`))
        ) - curTotalWidth;
        let curWidth =
          this.yScale(0) -
          this.yScale(Math.abs(eval(`this.${this.initLeftBars[i]}Data.norm`)));
        gRectsLeft
          .append("rect")
          .attr("id", `${this.initLeftBars[i]}-${this.boxId}`)
          .attr("fill", eval(`colorMap.${this.initLeftBars[i]}`))
          .attr("stroke", "black")
          .attr("x", curX)
          .attr("y", (barAttrs.two.startX[1] * this.boxWidth) / 200)
          .attr("width", curWidth)
          .attr("height", (barAttrs.two.width * this.boxWidth) / 200);
        curTotalWidth += curWidth;
      }
      // 添加1的基准线
      gRectsLeft
        .append("path")
        .attr("stroke-dasharray", "2, 2")
        .attr("stroke", "black")
        .attr(
          "d",
          `m ${this.yScale(1)} ${(barAttrs.two.startX[1] * this.boxWidth) /
            200} v ${(barAttrs.two.width * this.boxWidth) / 200}`
        );

      // 添加tooltip
      for (let dataName in colorMap) {
        d3.select(`#${dataName}-${this.boxId}`)
          .on("mouseover", function() {
            d3.select(`#tooltip_${that.boxId}`).style("display", "block");
          })
          .on("mousemove", function(e) {
            let key = d3
              .select(this)
              .attr("id")
              .split("-")[0];
            let value = eval(`that.${key}Data.value`).toFixed(2);
            let curOffsetX = e.offsetX;
            let curOffsetY = e.offsetY;
            if (that.initTopBars.indexOf(key) !== -1) {
              // top
            } else if (that.initRightBars.indexOf(key) !== -1) {
              // right
              curOffsetX += (80 * this.boxWidth) / 200;
            } else if (that.initBottomBars.indexOf(key) !== -1) {
              // bottom
              curOffsetY += (80 * that.boxWidth) / 200;
            } else {
              // left
            }
            key = weightKey[key]["en_name"];
            d3.select(`#tooltip_${that.boxId}`)
              .html(key + "<br>" + value)
              .style("left", curOffsetX + 10 + "px")
              .style("top", curOffsetY + 10 + "px")
              .style("transform", `rotate(${-that.curDegree}deg)`);
          })
          .on("mouseout", function() {
            d3.select(`#tooltip_${that.boxId}`).style("display", "none");
          });
      }

      this.curTopBars.forEach((d) => {
        if (["stock", "bond", "cash", "other"].indexOf(d) === -1) {
          d3.select(`#${d}-${this.boxId}`)
            .style("cursor", "pointer")
            .on("click", function() {
              that.$emit(
                "clickBar",
                d3
                  .select(this)
                  .attr("id")
                  .split("-")[0]
              );
            });
        }
      });
      this.lastTopBars = this.curTopBars;
    },
    updateTreemapColors() {
      // treemap
      const root = this.treemap(
        d3
          .hierarchy(this.holdingData)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );
      const leaf = this.centerSvg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);
      leaf
        .append("rect")
        .attr("fill", (d) =>
          this.userSectors && this.userSectors.indexOf(d.data.name) !== -1
            ? sectorDict[d.data.name].color
            : "#d8d8d8"
        )
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);
      leaf.append("title").text((d) => `${d.data.name}\n${d.value.toFixed(2)}`);
    },
    turnClockwise() {
      this.curDegree += 90;
      d3.select("#content_" + this.boxId).style(
        "transform",
        `rotate(${this.curDegree}deg)`
      );
      let that = this;
      this.curTopBars.forEach((d) => {
        if (["stock", "bond", "cash", "other"].indexOf(d) === -1) {
          d3.select(`#${d}-${this.boxId}`)
            .style("cursor", "pointer")
            .on("click", function() {
              that.$emit(
                "clickBar",
                d3
                  .select(this)
                  .attr("id")
                  .split("-")[0]
              );
            });
        }
      });
      this.lastTopBars.forEach((d) => {
        d3.select(`#${d}-${this.boxId}`)
          .style("cursor", "default")
          .on("click", null);
      });
      this.lastTopBars = this.curTopBars;
    },
    turnCounterClockwise() {
      this.curDegree -= 90;
      d3.select("#content_" + this.boxId).style(
        "transform",
        `rotate(${this.curDegree}deg)`
      );
      let that = this;
      this.curTopBars.forEach((d) => {
        if (["stock", "bond", "cash", "other"].indexOf(d) === -1) {
          d3.select(`#${d}-${this.boxId}`)
            .style("cursor", "pointer")
            .on("click", function() {
              that.$emit(
                "clickBar",
                d3
                  .select(this)
                  .attr("id")
                  .split("-")[0]
              );
            });
        }
      });
      this.lastTopBars.forEach((d) => {
        d3.select(`#${d}-${this.boxId}`)
          .style("cursor", "default")
          .on("click", null);
      });
      this.lastTopBars = this.curTopBars;
    },
    getSelectedBarCenterPoint(type) {
      // 获取该柱状图顶部中间点的相对坐标，用于画趋势虚线
      const dom = d3.select(`#${type}-${this.boxId}`);
      let relativeX, relativeY;
      if (this.initTopBars.indexOf(type) !== -1) {
        // top
        this.midPointX =
          parseFloat(dom.attr("width") / 2) +
          parseFloat(dom.attr("x")) +
          (60 * this.boxWidth) / 200;
        this.midPointY = parseFloat(dom.attr("y"));

        relativeX =
          parseFloat(dom.attr("width") / 2) + parseFloat(dom.attr("x"));
        relativeY = parseFloat(dom.attr("y"));
      } else if (this.initRightBars.indexOf(type) !== -1) {
        // right
        this.midPointX = parseFloat(dom.attr("width"));
        this.midPointY =
          parseFloat(dom.attr("height") / 2) +
          parseFloat(dom.attr("y")) +
          (60 * this.boxWidth) / 200;

        relativeX =
          parseFloat(dom.attr("height") / 2) + parseFloat(dom.attr("y"));
        relativeY = (60 * this.boxWidth) / 200 - parseFloat(dom.attr("width"));
      } else if (this.initBottomBars.indexOf(type) !== -1) {
        // bottom
        this.midPointX =
          parseFloat(dom.attr("x")) +
          parseFloat(dom.attr("width") / 2) +
          (60 * this.boxWidth) / 200;
        this.midPointY = parseFloat(dom.attr("height"));

        relativeX =
          (80 * this.boxWidth) / 200 -
          parseFloat(dom.attr("x")) -
          parseFloat(dom.attr("width") / 2);
        relativeY = (60 * this.boxWidth) / 200 - parseFloat(dom.attr("height"));
      } else {
        // left
        this.midPointX = parseFloat(dom.attr("x"));
        this.midPointY =
          parseFloat(dom.attr("height") / 2) +
          parseFloat(dom.attr("y")) +
          (60 * this.boxWidth) / 200;

        relativeX =
          (80 * this.boxWidth) / 200 -
          parseFloat(dom.attr("y")) -
          parseFloat(dom.attr("height") / 2);
        relativeY = parseFloat(dom.attr("x"));
      }
      return [relativeX, relativeY];
    },
    // 内部数据是正的，需要画两段虚线（除首尾的box）
    drawDashline(xPos1, yPos1, xPos2, yPos2, isFirst, isLast) {
      let curSvg = null;
      switch (this.curTopSide) {
        case "left":
          curSvg = this.leftSvg;
          break;
        case "top":
          curSvg = this.topSvg;
          break;
        case "right":
          curSvg = this.rightSvg;
          break;
        case "bottom":
          curSvg = this.bottomSvg;
          break;
        default:
          break;
      }
      const gDashline = curSvg.append("g").attr("id", `dashline_${this.boxId}`);
      gDashline
        .append("circle")
        .attr("cx", this.midPointX)
        .attr("cy", this.midPointY)
        .attr("r", 2)
        .attr("fill", "red")
        .attr("stroke", "red");
      if (!isFirst) {
        gDashline
          .append("path")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr(
            "d",
            `M ${xPos1} ${yPos1} L ${this.midPointX} ${this.midPointY}`
          );
      }
      if (!isLast) {
        gDashline
          .append("path")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr(
            "d",
            `M ${this.midPointX} ${this.midPointY} L ${xPos2} ${yPos2}`
          );
      }
    },
    // 内部数据是负的，直接横穿
    drawTraverseDashline(startX, startY, endX, endY) {
      let curSvg = null;
      switch (this.curTopSide) {
        case "left":
          curSvg = this.leftSvg;
          break;
        case "top":
          curSvg = this.topSvg;
          break;
        case "right":
          curSvg = this.rightSvg;
          break;
        case "bottom":
          curSvg = this.bottomSvg;
          break;
        default:
          break;
      }
      const gDashline = curSvg.append("g").attr("id", `dashline_${this.boxId}`);
      gDashline
        .append("path")
        .attr("stroke-dasharray", "2, 2")
        .attr("stroke", "black")
        .attr("d", `M ${startX} ${startY} L ${endX} ${endY}`);
    },
    removeDashline() {
      d3.select(`#dashline_${this.boxId}`).remove();
    },
  },
};
</script>

<style scoped>
.invest_style_box {
  position: relative;
  height: 220px;
  width: 200px;
  margin-top: 5px;
  margin-left: 60px;
  flex-shrink: 0;
  z-index: 3;
  background: #ffffff;
}

.text {
  position: absolute;
  width: 200px;
  height: 20px;
  text-align: center;
  font-size: 13px;
  font-family: PingFangSC-Regular;
  color: #185bbd;
  letter-spacing: 0;
}

.content {
  position: absolute;
  height: 200px;
  width: 200px;
  top: 20px;
  transition: transform 1s;
}

.center {
  position: absolute;
  height: 80px;
  width: 80px;
  border: 1px solid black;
  left: 60px;
  top: 60px;
}

.left {
  position: absolute;
  height: 200px;
  width: 60px;
  left: 0px;
  top: 0px;
}

.top {
  position: absolute;
  height: 60px;
  width: 200px;
  left: 0px;
  top: 0px;
}

.right {
  position: absolute;
  height: 200px;
  width: 60px;
  left: 140px;
  top: 0px;
}

.bottom {
  position: absolute;
  height: 60px;
  width: 200px;
  left: 0px;
  top: 140px;
}

.tooltip {
  position: absolute;
  text-align: center;
  max-width: 150px;
  max-height: 100px;
  padding: 6px;
  border: none;
  background: black;
  color: white;
  pointer-events: none;
  display: none;
  font-size: 10px;
}
</style>
