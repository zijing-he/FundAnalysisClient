<template>
  <div id="invest_style_box" class="invest_style_box">
    <div class="text" id="text">{{ boxText }}</div>
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
import sectorDict from "@/data/FundProfile/sector_dict.json";
import weightKey from "@/data/FundProfile/weight_key.json";

const colorMap = {
  alpha: "#ffff33",
  beta: "#ffffcc",
  sharp_ratio: "#984ea3",
  information_ratio: "#decbe4",
  stock: "#a65628",
  bond: "#377eb8",
  cash: "#f781bf",
  other: "#999999",
  nav_return: "#ff7f00",
  risk: "#fed9a6",
};

export default {
  name: "InvestStyleBox",
  props: {
    boxId: String,
    boxText: String,
    holdingData: Object,
    // 2.26
    max_drop_downData: Number,
    nav_returnData: Object,
    hs300Data: Number,
    riskData: Object,
    stockData: Number,
    bondData: Number,
    cashData: Number,
    otherData: Number,
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
      barTopMargin: 5,
      curDegree: 0,
      lastTopBars: [],
      midPointX: 0,
      midPointY: 0,
    };
  },

  mounted: function() {
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
    curTopBars() {
      if (this.curDegree % 360 === 0) {
        return ["nav_return", "risk"];
      } else if (this.curDegree % 360 === 90 || this.curDegree % 360 === -270) {
        return ["alpha", "beta"];
      } else if (
        this.curDegree % 360 === 180 ||
        this.curDegree % 360 === -180
      ) {
        return ["stock", "bond", "cash", "other"];
      } else {
        return ["sharp_ratio", "information_ratio"];
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
        .style("height", (220 * this.boxWidth) / 200 + "px")
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
      // version 4
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
        .attr("fill", (d) => sectorDict[d.data.name].color)
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);
      leaf.append("title").text((d) => `${d.data.name}\n${d.value.toFixed(2)}`);

      // bars
      let that = this;
      // tooltip
      // top
      this.yScale
        .domain([0, 1])
        .range([(60 * this.boxWidth) / 200, this.barTopMargin]);
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
        .attr("fill", `url(#top_pattern_stripe_${this.boxId})`);
      const gRectsTop = this.topSvg
        .append("g")
        .attr("transform", `translate(${(60 * this.boxWidth) / 200}, 0)`);
      gRectsTop
        .append("rect")
        .attr("id", "nav_return-" + this.boxId)
        .attr("fill", colorMap.nav_return)
        .attr(
          "mask",
          this.nav_returnData.norm < 0
            ? `url(#top_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", (7 * this.boxWidth) / 200)
        .attr("y", this.yScale(Math.abs(this.nav_returnData.norm)))
        .attr("width", (30 * this.boxWidth) / 200)
        .attr(
          "height",
          this.yScale(0) - this.yScale(Math.abs(this.nav_returnData.norm))
        );
      this.yScale
        .domain([0, 1.1])
        .range([(60 * this.boxWidth) / 200, this.barTopMargin]);
      gRectsTop
        .append("rect")
        .attr("id", "risk-" + this.boxId)
        .attr("fill", colorMap.risk)
        .attr(
          "mask",
          this.riskData.norm < 0
            ? `url(#top_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", (43 * this.boxWidth) / 200)
        .attr("y", this.yScale(Math.abs(this.riskData.norm)))
        .attr("width", (30 * this.boxWidth) / 200)
        .attr(
          "height",
          this.yScale(0) - this.yScale(Math.abs(this.riskData.norm))
        );
      this.yScale
        .domain([0, 1])
        .range([(60 * this.boxWidth) / 200, this.barTopMargin]);
      if (Math.abs(this.nav_returnData.norm) > Math.abs(this.hs300Data)) {
        gRectsTop
          .append("path")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr(
            "d",
            `M ${(7 * this.boxWidth) / 200} ${this.yScale(
              Math.abs(this.hs300Data)
            )} H ${(37 * this.boxWidth) / 200}`
          );
      } else {
        gRectsTop
          .append("rect")
          .attr("fill", "none")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr("x", (7 * this.boxWidth) / 200)
          .attr("y", this.yScale(Math.abs(this.hs300Data)))
          .attr("width", (30 * this.boxWidth) / 200)
          .attr(
            "height",
            this.yScale(Math.abs(this.nav_returnData.norm)) -
              this.yScale(Math.abs(this.hs300Data))
          );
      }
      // right
      this.yScale
        .domain([0, 1])
        .range([0, ((60 - this.barTopMargin) * this.boxWidth) / 200]);
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
      gRectsRight
        .append("rect")
        .attr("id", "sharp_ratio-" + this.boxId)
        .attr("fill", colorMap.sharp_ratio)
        .attr(
          "mask",
          this.sharp_ratioData.norm < 0
            ? `url(#right_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", 0)
        .attr("y", (7 * this.boxWidth) / 200)
        .attr(
          "width",
          this.yScale(Math.abs(this.sharp_ratioData.norm)) - this.yScale(0)
        )
        .attr("height", (30 * this.boxWidth) / 200);
      gRectsRight
        .append("rect")
        .attr("id", "information_ratio-" + this.boxId)
        .attr("fill", colorMap.information_ratio)
        .attr(
          "mask",
          this.information_ratioData.norm < 0
            ? `url(#right_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", 0)
        .attr("y", (43 * this.boxWidth) / 200)
        .attr(
          "width",
          this.yScale(Math.abs(this.information_ratioData.norm)) -
            this.yScale(0)
        )
        .attr("height", (30 * this.boxWidth) / 200);
      // bottom
      this.yScale
        .domain([0, 1])
        .range([0, ((60 - this.barTopMargin) * this.boxWidth) / 200]);
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
      gRectsBottom
        .append("rect")
        .attr("id", "stock-" + this.boxId)
        .attr("fill", colorMap.stock)
        .attr(
          "mask",
          this.stockData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", (4 * this.boxWidth) / 200)
        .attr("y", 0)
        .attr("width", (15 * this.boxWidth) / 200)
        .attr("height", this.yScale(Math.abs(this.stockData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "bond-" + this.boxId)
        .attr("fill", colorMap.bond)
        .attr(
          "mask",
          this.bondData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", (23 * this.boxWidth) / 200)
        .attr("y", 0)
        .attr("width", (15 * this.boxWidth) / 200)
        .attr("height", this.yScale(Math.abs(this.bondData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "cash-" + this.boxId)
        .attr("fill", colorMap.cash)
        .attr(
          "mask",
          this.cashData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", (42 * this.boxWidth) / 200)
        .attr("y", 0)
        .attr("width", (15 * this.boxWidth) / 200)
        .attr("height", this.yScale(Math.abs(this.cashData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "other-" + this.boxId)
        .attr("fill", colorMap.other)
        .attr(
          "mask",
          this.otherData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", (61 * this.boxWidth) / 200)
        .attr("y", 0)
        .attr("width", (15 * this.boxWidth) / 200)
        .attr("height", this.yScale(Math.abs(this.otherData)) - this.yScale(0));
      // left
      this.yScale
        .domain([0, 1])
        .range([
          (60 * this.boxWidth) / 200,
          (this.barTopMargin * this.boxWidth) / 200,
        ]);
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
      gRectsLeft
        .append("rect")
        .attr("id", "alpha-" + this.boxId)
        .attr("fill", colorMap.alpha)
        .attr(
          "mask",
          this.alphaData.norm < 0
            ? `url(#left_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", this.yScale(Math.abs(this.alphaData.norm)))
        .attr("y", (7 * this.boxWidth) / 200)
        .attr(
          "width",
          this.yScale(0) - this.yScale(Math.abs(this.alphaData.norm))
        )
        .attr("height", (30 * this.boxWidth) / 200);
      gRectsLeft
        .append("rect")
        .attr("id", "beta-" + this.boxId)
        .attr("fill", colorMap.beta)
        .attr(
          "mask",
          this.betaData.norm < 0
            ? `url(#left_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", this.yScale(Math.abs(this.betaData.norm)))
        .attr("y", (43 * this.boxWidth) / 200)
        .attr(
          "width",
          this.yScale(0) - this.yScale(Math.abs(this.betaData.norm))
        )
        .attr("height", (30 * this.boxWidth) / 200);

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
            let value;
            if (
              [
                "nav_return",
                "risk",
                "alpha",
                "beta",
                "sharp_ratio",
                "information_ratio",
              ].indexOf(key) !== -1
            )
              value = eval(`that.${key}Data.value`).toFixed(2);
            else value = eval(`that.${key}Data`).toFixed(2);
            let curOffsetX = e.offsetX;
            let curOffsetY = e.offsetY;
            if (["nav_return", "risk"].indexOf(key) !== -1) {
              // top
            } else if (
              ["sharp_ratio", "information_ratio"].indexOf(key) !== -1
            ) {
              // right
              curOffsetX += (80 * this.boxWidth) / 200;
            } else if (["stock", "bond", "cash", "other"].indexOf(key) !== -1) {
              // bottom
              curOffsetY += (80 * this.boxWidth) / 200;
            } else {
              // left
            }
            key = weightKey[key]["cn_name"];
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
      });
      this.lastTopBars = this.curTopBars;
    },
    turnClockwise() {
      this.curDegree += 90;
      d3.select("#content_" + this.boxId).style(
        "transform",
        `rotate(${this.curDegree}deg)`
      );
      let that = this;
      this.curTopBars.forEach((d) => {
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
      });
      this.lastTopBars.forEach((d) => {
        d3.select(`#${d}-${this.boxId}`)
          .style("cursor", "default")
          .on("click", null);
      });
      this.lastTopBars = this.curTopBars;
    },
    getSelectedBarCenterPoint(type) {
      const dom = d3.select(`#${type}-${this.boxId}`);
      let relativeX, relativeY;
      if (["nav_return", "risk"].indexOf(type) !== -1) {
        // top
        this.midPointX =
          parseFloat(dom.attr("width") / 2) +
          parseFloat(dom.attr("x")) +
          (60 * this.boxWidth) / 200;
        this.midPointY = parseFloat(dom.attr("y"));

        relativeX =
          parseFloat(dom.attr("width") / 2) + parseFloat(dom.attr("x"));
        relativeY = parseFloat(dom.attr("y"));
      } else if (["sharp_ratio", "information_ratio"].indexOf(type) !== -1) {
        // right
        this.midPointX = parseFloat(dom.attr("width"));
        this.midPointY =
          parseFloat(dom.attr("height") / 2) +
          parseFloat(dom.attr("y")) +
          (60 * this.boxWidth) / 200;

        relativeX =
          parseFloat(dom.attr("height") / 2) + parseFloat(dom.attr("y"));
        relativeY = (60 * this.boxWidth) / 200 - parseFloat(dom.attr("width"));
      } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
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
    // 内部数据是正的
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
  background-color: white;
}

.text {
  position: absolute;
  width: 200px;
  height: 20px;
  text-align: center;
  font-size: 13px;
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
  max-height: 50px;
  padding: 6px;
  border: none;
  background: black;
  color: white;
  pointer-events: none;
  display: none;
}
</style>
