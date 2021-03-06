<template>
  <div id="invest_style_box" class="invest_style_box">
    <div class="text" id="text">{{ boxText }}</div>
    <div class="content" id="content">
      <!-- <div class="icons" id="icons">
        <div :key="index" :style="icon.style" v-for="(icon, index) in icons">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="icon.id"></use>
          </svg>
        </div>
      </div> -->
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

// const iconMap = {
//   有色金属: "#iconyousejinshu",
//   汽车: "#iconche1-copy",
//   医药生物: "#iconyiyao",
//   交通运输: "#iconjiaotongyunshu",
//   传媒: "#iconmediatb",
//   化工: "#iconhuagong",
//   银行: "#iconyinhang1",
//   非银金融: "#iconfeiyinjinrong",
//   机械设备: "#iconjixieshebei",
//   建筑装饰: "#iconjianzhuzhuangshi",
//   纺织服装: "#iconfangzhifuzhuang",
//   食品饮料: "#iconshipinyinliao",
//   电子: "#icondianzi",
//   计算机: "#iconjisuanjicomputer160",
//   钢铁: "#icongangtie",
//   电气设备: "#icondianqishebei",
//   采掘: "#iconcaijue",
//   国防军工: "#iconguofangjungong",
//   农林牧渔: "#iconnonglinmuyu",
//   综合: "#iconzonghe",
//   轻工制造: "#iconqinggongzhizao",
//   公用事业: "#icongongyongshiye",
//   通信: "#icontongxin-copy",
//   家用电器: "#iconappliances",
//   房地产: "#iconreal-estate",
//   商业贸易: "#iconshangyemaoyi",
//   休闲服务: "#iconxiuxianfuwu",
//   未知: "#iconweizhi",
//   建筑材料: "#iconjianzhucailiao",
// };

// 2.26
// const dataNames = [
//   "drop",
//   "risk",
//   "stock",
//   "bond",
//   "cash",
//   "other",
//   "size",
//   "alpha",
//   "beta",
//   "sharp",
//   "info",
// ];

const colorMap = {
  alpha: "#f4cae4",
  beta: "#fff2ae",
  sharp: "#fdcdac",
  info: "#cbd5e8",
  stock: "#fbb4ae",
  bond: "#b3cde3",
  cash: "#ccebc5",
  other: "#decbe4",
  navReturn: "#e5d8bd",
  risk: "#33a02c",
};

export default {
  name: "InvestStyleBox",
  props: {
    boxId: String,
    boxText: String,
    innerRadius: Number,
    outerRadius: Number,
    datum: Object,
    holdingData: Object,
    // 2.26
    dropData: Number,
    navReturnData: Number,
    hs300Data: Number,
    riskData: Number,
    stockData: Number,
    bondData: Number,
    cashData: Number,
    otherData: Number,
    sizeData: Number,
    alphaData: Number,
    betaData: Number,
    sharpData: Number,
    infoData: Number,
    boxWidth: Number,
    contentWidth: Number,
    boxGap: Number,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      width: 200,
      // 2.26
      // width: 304,
      height: 200,
      data: null,
      ratioColors: { org: "rgb(75, 135, 203)", person: "rgb(92, 26, 142)" },
      circleColors: {
        high: "rgb(254, 180, 7)",
        mid: "rgb(239, 161, 112)",
        low: "rgb(255, 240, 193)",
      },
      largeRadius: 47,
      smallRadius: 13,
      icons: [],
      // 2.26
      // barData: {
      //   drop: this.dropData,
      //   risk: this.riskData,
      //   stock: this.stockData,
      //   bond: this.bondData,
      //   cash: this.cashData,
      //   other: this.otherData,
      //   size: this.sizeData,
      //   alpha: this.alphaData,
      //   beta: this.betaData,
      //   sharp: this.sharpData,
      //   info: this.infoData,
      // },
      // barMargin: { top: 20, bottom: 20, left: 10, right: 0 },
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
    this.largeRadius = this.innerRadius - 3;
    this.smallRadius = (this.largeRadius * 13) / 47;
    this.renderInit();
    this.renderUpdate();
  },

  computed: {
    topMargin() {
      return (this.height - 2 * this.outerRadius) / 2;
    },
    // 2.26
    // xScale() {
    //   return d3
    //     .scaleBand()
    //     .range([this.barMargin.left, this.contentWidth])
    //     .domain(d3.range(dataNames.length))
    //     .padding(0.1);
    // },
    // yScale() {
    //   return d3
    //     .scaleLinear()
    //     .range([this.height - this.barMargin.bottom, this.barMargin.top]);
    // },
    treemap() {
      return d3
        .treemap()
        .tile(d3.treemapSquarify)
        .size([80, 80])
        .padding(1)
        .round(true);
    },
    yScale() {
      return d3.scaleLinear();
    },
    curTopBars() {
      if (this.curDegree % 360 === 0) {
        return ["navReturn", "risk"];
      } else if (this.curDegree % 360 === 90 || this.curDegree % 360 === -270) {
        return ["alpha", "beta"];
      } else if (
        this.curDegree % 360 === 180 ||
        this.curDegree % 360 === -180
      ) {
        return ["stock", "bond", "cash", "other"];
      } else {
        return ["sharp", "info"];
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
        .style("margin-left", this.boxGap + "px");
      d3.select("#text")
        .attr("id", "text_" + this.boxId)
        .style("width", this.contentWidth + "px");
      d3.select("#content")
        .attr("id", "content_" + this.boxId)
        .style("width", this.contentWidth + "px");
      d3.select("#center").attr("id", "center_" + this.boxId);
      d3.select("#left").attr("id", "left_" + this.boxId);
      d3.select("#top").attr("id", "top_" + this.boxId);
      d3.select("#right").attr("id", "right_" + this.boxId);
      d3.select("#bottom").attr("id", "bottom_" + this.boxId);
      d3.select("#tooltip").attr("id", "tooltip_" + this.boxId);
      d3.select("#icons").attr("id", "icons_" + this.boxId);
      this.centerSvg = d3
        .select("#center_" + this.boxId)
        .append("svg")
        .attr("width", 80)
        .attr("height", 80)
        .attr("viewBox", [0, 0, 80, 80]);
      this.leftSvg = d3
        .select("#left_" + this.boxId)
        .append("svg")
        .attr("width", 60)
        .attr("height", 200)
        .attr("viewBox", [0, 0, 60, 200]);
      this.topSvg = d3
        .select("#top_" + this.boxId)
        .append("svg")
        .attr("width", 200)
        .attr("height", 60)
        .attr("viewBox", [0, 0, 200, 60]);
      this.rightSvg = d3
        .select("#right_" + this.boxId)
        .append("svg")
        .attr("width", 60)
        .attr("height", 200)
        .attr("viewBox", [0, 0, 60, 200]);
      this.bottomSvg = d3
        .select("#bottom_" + this.boxId)
        .append("svg")
        .attr("width", 200)
        .attr("height", 60)
        .attr("viewBox", [0, 0, 200, 60]);
    },
    renderUpdate() {
      // version 1
      // 占比
      // gRatio
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", 15)
      //   .attr("height", 60)
      //   .attr("fill", this.ratioColors.org)
      // gRatio
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 60)
      //   .attr("width", 15)
      //   .attr("height", 70)
      //   .attr("fill", this.ratioColors.person);

      // 九宫格
      // const gScale = this.svg.append("g").attr("transform", "translate(40, 20)");
      // gScale
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", 111)
      //   .attr("height", 111)
      //   .attr("stroke", "black")
      //   .attr("fill", "white");
      // gScale
      //   .append("path")
      //   .attr("d", "M 0 37 H 111")
      //   .attr("stroke", "black");
      // gScale
      //   .append("path")
      //   .attr("d", "M 0 74 H 111")
      //   .attr("stroke", "black");
      // gScale
      //   .append("path")
      //   .attr("d", "M 37 0 V 111")
      //   .attr("stroke", "black");
      // gScale
      //   .append("path")
      //   .attr("d", "M 74 0 V 111")
      //   .attr("stroke", "black");

      // 填色
      // gScale.append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", 37)
      //   .attr("height", 37)
      //   .attr("stroke", "black")
      //   .attr("fill", this.rectColors.high);
      // gScale.append("rect")
      //   .attr("x", 37)
      //   .attr("y", 0)
      //   .attr("width", 37)
      //   .attr("height", 37)
      //   .attr("stroke", "black")
      //   .attr("fill", this.rectColors.low);
      // gScale.append("rect")
      //   .attr("x", 0)
      //   .attr("y", 37)
      //   .attr("width", 37)
      //   .attr("height", 37)
      //   .attr("stroke", "black")
      //   .attr("fill", this.rectColors.mid);

      // version 2
      // // 占比
      // // eslint-disable-next-line no-prototype-builtins
      // if (this.datum.hasOwnProperty("instl_weight") && this.datum.hasOwnProperty("retail_weight")) {
      //   const instlWeight = this.datum["instl_weight"];
      //   const gRatioInstl = this.svg.append("g").attr("transform", `translate(76, ${this.topMargin})`);
      //   const degree = instlWeight * 180;
      //   const rad = degree * Math.PI / 180;
      //   let x1 = -this.outerRadius * Math.sin(rad).toFixed(2);
      //   let y1 = (this.outerRadius - this.outerRadius * Math.cos(rad)).toFixed(2);
      //   let x2 = -this.innerRadius * Math.sin(rad).toFixed(2);
      //   let y2 = (this.outerRadius - this.innerRadius * Math.cos(rad)).toFixed(2);
      //   let x3 = 0;
      //   let y3 = this.outerRadius - this.innerRadius;
      //   const d1 = ['M', 0, 0,
      //               'A', this.outerRadius, this.outerRadius, 0, 0, 0, x1, y1,
      //               'L', x2, y2,
      //               'A', this.innerRadius, this.innerRadius, 0, 0, 1, x3, y3,
      //               'L', 0, 0];
      //   gRatioInstl
      //     .append("path")
      //     .attr("d", d1.join(' '))
      //     .attr("fill", this.ratioColors.org);
      //   const gRatioRetail = this.svg.append("g").attr("transform", `translate(76, ${this.topMargin + 2 * this.outerRadius})`);
      //   y1 -= 2 * this.outerRadius;
      //   y2 -= 2 * this.outerRadius;
      //   y3 = -y3;
      //   const d2 = ['M', 0, 0,
      //               'A', this.outerRadius, this.outerRadius, 0, 0, 1, x1, y1,
      //               'L', x2, y2,
      //               'A', this.innerRadius, this.innerRadius, 0, 0, 0, x3, y3,
      //               'L', 0, 0];
      //   gRatioRetail
      //     .append("path")
      //     .attr("d", d2.join(' '))
      //     .attr("fill", this.ratioColors.person);
      // }

      // // 圆
      // const gCircle = this.svg.append("g").attr("transform", `translate(76, ${this.topMargin + this.outerRadius - this.largeRadius})`);
      // gCircle
      //   .append("circle")
      //   .attr("cx", 0)
      //   .attr("cy", this.largeRadius)
      //   .attr("r", this.largeRadius)
      //   .attr("stroke", "black")
      //   .attr("fill", "white");
      // const tmp = (this.largeRadius - this.smallRadius) * Math.cos(Math.PI / 4).toFixed(2);
      // const xPos = [0, this.smallRadius - this.largeRadius, this.largeRadius - this.smallRadius, 0, 0,
      //               -tmp, tmp, -tmp, tmp];
      // const yPos = [this.largeRadius, this.largeRadius, this.largeRadius, this.smallRadius, this.largeRadius * 2 - this.smallRadius,
      //               this.largeRadius - tmp, this.largeRadius - tmp, this.largeRadius + tmp, this.largeRadius + tmp];
      // for (let i = 0; i < xPos.length; i++) {
      //   gCircle
      //     .append("circle")
      //     .attr("cx", xPos[i])
      //     .attr("cy", yPos[i])
      //     .attr("r", this.smallRadius)
      //     .attr("stroke", "black")
      //     .attr("fill", "white")
      //     .attr("id", "circle_" + i);
      // }
      // d3.selectAll("#circle_5").attr("fill", this.circleColors.high);

      // // 图标
      // let sum = d3.sum(this.holdingDataSorted);
      // let totalRad = Math.PI;
      // let curRad = 0;
      // let curSum = 0;
      // this.holdingDataSorted.forEach((d, i) => {
      //   curSum += d;
      //   curRad = curSum / sum * totalRad;
      //   let leftMargin = this.largeRadius * Math.sin(curRad);
      //   let topMargin = Math.abs(this.largeRadius * Math.cos(curRad));
      //   topMargin = (curRad < Math.PI / 2) ? (this.outerRadius - topMargin) : (this.outerRadius + topMargin);
      //   let boxWidth = this.outerRadius - this.innerRadius + 2;
      //   topMargin = (curRad < Math.PI / 2) ? (topMargin - boxWidth + this.topMargin) : (topMargin + this.topMargin);
      //   leftMargin = (curRad < Math.PI / 2) ? (leftMargin + 5) : leftMargin;
      //   let styleObject = {
      //     position: "absolute",
      //     top: topMargin + "px",
      //     left: leftMargin + "px",
      //     width: boxWidth + "px",
      //     height: boxWidth + "px",
      //   };
      //   this.icons.push({
      //     id: iconMap[this.holdingDataKeys[i]],
      //     style: styleObject,
      //   });
      // });

      // 2.26 version 3
      // const gRects = this.svg.append("g");
      // dataNames.forEach((d, i) => {
      //   // this.yScale.domain(d3.extent(this.barData[d]));
      //   this.yScale.domain([0, 1]);
      //   gRects
      //     .append("rect")
      //     .attr("x", this.xScale(i))
      //     .attr("y", this.yScale(this.barData[d][this.index]))
      //     .attr("width", this.xScale.bandwidth())
      //     .attr("height", this.yScale(0) - this.yScale(this.barData[d][this.index]))
      //     .attr("fill", "steelblue");
      // });
      // this.svg.append("g")
      //   .attr("transform", "translate(0, 111)")
      //   .call(d3.axisBottom(this.xScale).tickFormat(i => dataNames[i]).tickSizeOuter(0));

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
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      leaf
        .append("rect")
        .attr("fill", (d) => color(d.data.name))
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);
      leaf.append("title").text((d) => `${d.data.name}\n${d.value.toFixed(2)}`);

      // bars
      let that = this;
      // tooltip
      // top
      this.yScale.domain([0, 1]).range([60, this.barTopMargin]);
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
        .attr("transform", "translate(60, 0)");
      gRectsTop
        .append("rect")
        .attr("id", "navReturn_" + this.boxId)
        .attr("fill", colorMap.navReturn)
        .attr(
          "mask",
          this.navReturnData < 0
            ? `url(#top_mask_stripe_${this.boxId})`
            : "none"
        )
        .attr("x", 7)
        .attr("y", this.yScale(Math.abs(this.navReturnData)))
        .attr("width", 30)
        .attr(
          "height",
          this.yScale(0) - this.yScale(Math.abs(this.navReturnData))
        );
      this.yScale.domain([0, 1.1]).range([60, this.barTopMargin]);
      gRectsTop
        .append("rect")
        .attr("id", "risk_" + this.boxId)
        .attr("fill", colorMap.risk)
        .attr(
          "mask",
          this.riskData < 0 ? `url(#top_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 43)
        .attr("y", this.yScale(Math.abs(this.riskData)))
        .attr("width", 30)
        .attr("height", this.yScale(0) - this.yScale(Math.abs(this.riskData)));
      this.yScale.domain([0, 1]).range([60, this.barTopMargin]);
      if (Math.abs(this.navReturnData) > Math.abs(this.hs300Data)) {
        gRectsTop
          .append("path")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr("d", `M 7 ${this.yScale(Math.abs(this.hs300Data))} H 37`);
      } else {
        gRectsTop
          .append("rect")
          .attr("fill", "none")
          .attr("stroke-dasharray", "2, 2")
          .attr("stroke", "black")
          .attr("x", 7)
          .attr("y", this.yScale(Math.abs(this.hs300Data)))
          .attr("width", 30)
          .attr(
            "height",
            this.yScale(Math.abs(this.navReturnData)) -
              this.yScale(Math.abs(this.hs300Data))
          );
      }
      // right
      this.yScale.domain([0, 1]).range([0, 60 - this.barTopMargin]);
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
        .attr("transform", "translate(0, 60)");
      gRectsRight
        .append("rect")
        .attr("id", "sharp_" + this.boxId)
        .attr("fill", colorMap.sharp)
        .attr(
          "mask",
          this.sharpData < 0 ? `url(#right_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 0)
        .attr("y", 7)
        .attr("width", this.yScale(Math.abs(this.sharpData)) - this.yScale(0))
        .attr("height", 30);
      gRectsRight
        .append("rect")
        .attr("id", "info_" + this.boxId)
        .attr("fill", colorMap.info)
        .attr(
          "mask",
          this.infoData < 0 ? `url(#right_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 0)
        .attr("y", 43)
        .attr("width", this.yScale(Math.abs(this.infoData)) - this.yScale(0))
        .attr("height", 30);
      // bottom
      this.yScale.domain([0, 1]).range([0, 60 - this.barTopMargin]);
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
        .attr("transform", "translate(60, 0)");
      gRectsBottom
        .append("rect")
        .attr("id", "stock_" + this.boxId)
        .attr("fill", colorMap.stock)
        .attr(
          "mask",
          this.stockData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 4)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", this.yScale(Math.abs(this.stockData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "bond_" + this.boxId)
        .attr("fill", colorMap.bond)
        .attr(
          "mask",
          this.bondData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 23)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", this.yScale(Math.abs(this.bondData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "cash_" + this.boxId)
        .attr("fill", colorMap.cash)
        .attr(
          "mask",
          this.cashData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 42)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", this.yScale(Math.abs(this.cashData)) - this.yScale(0));
      gRectsBottom
        .append("rect")
        .attr("id", "other_" + this.boxId)
        .attr("fill", colorMap.other)
        .attr(
          "mask",
          this.otherData < 0 ? `url(#bottom_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", 61)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", this.yScale(Math.abs(this.otherData)) - this.yScale(0));
      // left
      this.yScale.domain([0, 1]).range([60, this.barTopMargin]);
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
        .attr("transform", "translate(0, 60)");
      gRectsLeft
        .append("rect")
        .attr("id", "alpha_" + this.boxId)
        .attr("fill", colorMap.alpha)
        .attr(
          "mask",
          this.alphaData < 0 ? `url(#left_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", this.yScale(Math.abs(this.alphaData)))
        .attr("y", 7)
        .attr("width", this.yScale(0) - this.yScale(Math.abs(this.alphaData)))
        .attr("height", 30);
      gRectsLeft
        .append("rect")
        .attr("id", "beta_" + this.boxId)
        .attr("fill", colorMap.beta)
        .attr(
          "mask",
          this.betaData < 0 ? `url(#left_mask_stripe_${this.boxId})` : "none"
        )
        .attr("x", this.yScale(Math.abs(this.betaData)))
        .attr("y", 43)
        .attr("width", this.yScale(0) - this.yScale(Math.abs(this.betaData)))
        .attr("height", 30);

      for (let dataName in colorMap) {
        d3.select(`#${dataName}_${this.boxId}`)
          .on("mouseover", function() {
            d3.select(`#tooltip_${that.boxId}`).style("display", "block");
          })
          .on("mousemove", function(e) {
            // console.log(e.offsetX, e.offsetY);
            const key = d3
              .select(this)
              .attr("id")
              .split("_")[0];
            const value = eval(`that.${key}Data`).toFixed(2);
            let curOffsetX = e.offsetX;
            let curOffsetY = e.offsetY;
            if (["navReturn", "risk"].indexOf(key) !== -1) {
              // top
            } else if (["sharp", "info"].indexOf(key) !== -1) {
              // right
              curOffsetX += 80;
            } else if (["stock", "bond", "cash", "other"].indexOf(key) !== -1) {
              // bottom
              curOffsetY += 80;
            } else {
              // left
            }
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
        d3.select(`#${d}_${this.boxId}`)
          .style("cursor", "pointer")
          .on("click", function() {
            that.$emit(
              "clickBar",
              d3
                .select(this)
                .attr("id")
                .split("_")[0]
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
        d3.select(`#${d}_${this.boxId}`)
          .style("cursor", "pointer")
          .on("click", function() {
            that.$emit(
              "clickBar",
              d3
                .select(this)
                .attr("id")
                .split("_")[0]
            );
          });
      });
      this.lastTopBars.forEach((d) => {
        d3.select(`#${d}_${this.boxId}`)
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
        d3.select(`#${d}_${this.boxId}`)
          .style("cursor", "pointer")
          .on("click", function() {
            that.$emit(
              "clickBar",
              d3
                .select(this)
                .attr("id")
                .split("_")[0]
            );
          });
      });
      this.lastTopBars.forEach((d) => {
        d3.select(`#${d}_${this.boxId}`)
          .style("cursor", "default")
          .on("click", null);
      });
      this.lastTopBars = this.curTopBars;
    },
    getSelectedBarCenterPoint(type) {
      const dom = d3.select(`#${type}_${this.boxId}`);
      let relativeX, relativeY;
      if (["navReturn", "risk"].indexOf(type) !== -1) {
        // top
        this.midPointX =
          parseFloat(dom.attr("width") / 2) + parseFloat(dom.attr("x")) + 60;
        this.midPointY = parseFloat(dom.attr("y"));

        relativeX =
          parseFloat(dom.attr("width") / 2) + parseFloat(dom.attr("x"));
        relativeY = parseFloat(dom.attr("y"));
      } else if (["sharp", "info"].indexOf(type) !== -1) {
        // right
        this.midPointX = parseFloat(dom.attr("width"));
        this.midPointY =
          parseFloat(dom.attr("height") / 2) + parseFloat(dom.attr("y")) + 60;

        relativeX =
          parseFloat(dom.attr("height") / 2) + parseFloat(dom.attr("y"));
        relativeY = 60 - parseFloat(dom.attr("width"));
      } else if (["stock", "bond", "cash", "other"].indexOf(type) !== -1) {
        // bottom
        this.midPointX =
          parseFloat(dom.attr("x")) + parseFloat(dom.attr("width") / 2) + 60;
        this.midPointY = parseFloat(dom.attr("height"));

        relativeX =
          80 - parseFloat(dom.attr("x")) - parseFloat(dom.attr("width") / 2);
        relativeY = 60 - parseFloat(dom.attr("height"));
      } else {
        // left
        this.midPointX = parseFloat(dom.attr("x"));
        this.midPointY =
          parseFloat(dom.attr("height") / 2) + parseFloat(dom.attr("y")) + 60;

        relativeX =
          80 - parseFloat(dom.attr("y")) - parseFloat(dom.attr("height") / 2);
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
    // 内部数据是正的，直接横穿
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
    }
  },
};
</script>

<style scoped>
.invest_style_box {
  position: relative;
  height: 220px;
  width: 200px;
  /* 2.26 */
  /* width: 312px; */
  /* border: 1px solid black; */
  margin-top: 5px;
  margin-left: 60px;
  flex-shrink: 0;
  z-index: 3;
  background-color: white;
}

.text {
  position: absolute;
  width: 200px;
  /* 2.26 */
  /* width: 304px; */
  height: 20px;
  text-align: center;
  font-size: 13px;
}

.content {
  position: absolute;
  height: 200px;
  width: 200px;
  /* 2.26 */
  /* width: 304px; */
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
