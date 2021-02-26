<template>
  <div id="invest_style_box" class="invest_style_box">
    <div class="text">{{boxText}}</div>
    <div class="content" id="content">
      <!-- <div class="icons" id="icons">
        <div :key="index" :style="icon.style" v-for="(icon, index) in icons">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="icon.id"></use>
          </svg>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

const iconMap = {
  有色金属: "#iconyousejinshu",
  汽车: "#iconche1-copy",
  医药生物: "#iconyiyao",
  交通运输: "#iconjiaotongyunshu",
  传媒: "#iconmediatb",
  化工: "#iconhuagong",
  银行: "#iconyinhang1",
  非银金融: "#iconfeiyinjinrong",
  机械设备: "#iconjixieshebei",
  建筑装饰: "#iconjianzhuzhuangshi",
  纺织服装: "#iconfangzhifuzhuang",
  食品饮料: "#iconshipinyinliao",
  电子: "#icondianzi",
  计算机: "#iconjisuanjicomputer160",
  钢铁: "#icongangtie",
  电气设备: "#icondianqishebei",
  采掘: "#iconcaijue",
  国防军工: "#iconguofangjungong",
  农林牧渔: "#iconnonglinmuyu",
  综合: "#iconzonghe",
  轻工制造: "#iconqinggongzhizao",
  公用事业: "#icongongyongshiye",
  通信: "#icontongxin-copy",
  家用电器: "#iconappliances",
  房地产: "#iconreal-estate",
  商业贸易: "#iconshangyemaoyi",
  休闲服务: "#iconxiuxianfuwu",
  未知: "#iconweizhi",
  建筑材料: "#iconjianzhucailiao",
};

// 2.26
const dataNames = ["nav", "risk", "stock", "bond", "cash", "other", "size", "alpha", "beta", "sharp", "info"];

export default {
  name: "InvestStyleBox",
  props: {
    boxId: String,
    boxText: String,
    innerRadius: Number,
    outerRadius: Number,
    datum: Object,
    holdingDataKeys: Object,
    holdingDataSorted: Object,
    // 2.26
    navData: Object,
    riskData: Object,
    stockData: Object,
    bondData: Object,
    cashData: Object,
    otherData: Object,
    sizeData: Object,
    alphaData: Object,
    betaData: Object,
    sharpData: Object,
    infoData: Object,
    index: Number,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      // width: 152,
      // 2.26
      width: 304,
      height: 151,
      data: null,
      ratioColors: { org: "rgb(75, 135, 203)", person: "rgb(92, 26, 142)" },
      circleColors: { high: "rgb(254, 180, 7)", mid: "rgb(239, 161, 112)", low: "rgb(255, 240, 193)" },
      largeRadius: 47,
      smallRadius: 13,
      icons: [],
      // 2.26
      rectData: {
        nav: this.navData,
        risk: this.riskData,
        stock: this.stockData,
        bond: this.bondData,
        cash: this.cashData,
        other: this.otherData,
        size: this.sizeData,
        alpha: this.alphaData,
        beta: this.betaData,
        sharp: this.sharpData,
        info: this.infoData,
      },
    };
  },

  mounted: function () {
    this.largeRadius = this.innerRadius - 3;
    this.smallRadius = this.largeRadius * 13 / 47;
    this.renderInit();
    this.renderUpdate();
  },

  computed: {
    topMargin() {
      return (this.height - 2 * this.outerRadius) / 2;
    },
    // 2.26
    xScale() {
      return d3
        .scaleBand()
        .range([10, 304])
        .domain(d3.range(dataNames.length))
        .padding(0.1);
    },
    yScale() {
      return d3
        .scaleLinear()
        .range([151 - 20, 20]);
    },
  },

  methods: {
    renderInit() {
      d3
        .select("#invest_style_box").attr("id", "invest_style_box_" + this.boxId);
      d3
        .select("#content").attr("id", "content_" + this.boxId);
      d3
        .select("#icons").attr("id", "icons_" + this.boxId);
      this.svg = d3
        .select("#content_" + this.boxId)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // 原来的设计
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

      // 2.26
      const gRects = this.svg.append("g");
      dataNames.forEach((d, i) => {
        this.yScale.domain(d3.extent(this.rectData[d]));
        console.log(d3.min(this.rectData[d]));
        gRects
          .append("rect")
          .attr("x", this.xScale(i))
          .attr("y", this.yScale(this.rectData[d][this.index]))
          .attr("width", this.xScale.bandwidth())
          .attr("height", this.yScale(d3.min(this.rectData[d])) - this.yScale(this.rectData[d][this.index]))
          .attr("fill", "steelblue");
      });
      this.svg.append("g")
        .attr("transform", "translate(0, 131)")
        .call(d3.axisBottom(this.xScale).tickFormat(i => dataNames[i]).tickSizeOuter(0));
      

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
    },
  },
};
</script>

<style scoped>
.invest_style_box {
  position: relative;
  height: 175px;
  /* width: 156px; */
  /* 2.26 */
  width: 312px;
  border: 1px solid black;
  margin-top: 5px;
  margin-left: 60px;
  flex-shrink: 0;
  z-index: 2;
  background-color: white;
}

.text {
  position: absolute;
  /* width: 152px; */
  /* 2.26 */
  width: 304px;
  height: 20px;
  text-align: center;
  font-size: 13px;
}

.content {
  position: absolute;
  height: 151px;
  /* width: 152px; */
  /* 2.26 */
  width: 304px;
  top: 20px;
}

.icons {
  position: absolute;
  height: 151px;
  width: 76px;
  left: 76px;
}

.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>