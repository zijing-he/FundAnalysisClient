<template>
  <div id="invest_style_box" class="invest_style_box">
    <div class="text">{{boxText}}</div>
    <div class="content" id="content"></div>
    <div id="up_icons">
      <HomeOutlined />
      <SettingFilled />
    </div>
    <div id="right_icons">
      <SmileOutlined />
      <SyncOutlined />
    </div>
    <div id="down_icons">
      <SyncOutlined />
      <HomeOutlined />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';

export default {
  name: "InvestStyleBox",
  props: {
    boxId: String,
    boxText: String,
  },
  components: {
    HomeOutlined,
    SettingFilled,
    SmileOutlined,
    SyncOutlined,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      width: 152,
      height: 151,
      data: null,
      ratioColors: { org: "rgb(75, 135, 203)", person: "rgb(92, 26, 142)" },
      rectColors: { high: "rgb(254, 180, 7)", mid: "rgb(239, 161, 112)", low: "rgb(255, 240, 193)" }
    };
  },

  mounted: function () {
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
  },

  methods: {
    renderInit() {
      d3
        .select("#invest_style_box").attr("id", "invest_style_box_" + this.boxId);
      d3
        .select("#content").attr("id", this.boxId)
      this.svg = d3
        .select("#" + this.boxId)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height]);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // 占比
      const gRatio = this.svg.append("g").attr("transform", "translate(15, 10)");
      gRatio
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 60)
        .attr("fill", this.ratioColors.org)
      gRatio
        .append("rect")
        .attr("x", 0)
        .attr("y", 60)
        .attr("width", 15)
        .attr("height", 70)
        .attr("fill", this.ratioColors.person);

      // 九宫格
      const gScale = this.svg.append("g").attr("transform", "translate(40, 20)");
      gScale
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 111)
        .attr("height", 111)
        .attr("stroke", "black")
        .attr("fill", "white");
      gScale
        .append("path")
        .attr("d", "M 0 37 H 111")
        .attr("stroke", "black");
      gScale
        .append("path")
        .attr("d", "M 0 74 H 111")
        .attr("stroke", "black");
      gScale
        .append("path")
        .attr("d", "M 37 0 V 111")
        .attr("stroke", "black");
      gScale
        .append("path")
        .attr("d", "M 74 0 V 111")
        .attr("stroke", "black");
      
      // 填色
      gScale.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 37)
        .attr("height", 37)
        .attr("stroke", "black")
        .attr("fill", this.rectColors.high);
      gScale.append("rect")
        .attr("x", 37)
        .attr("y", 0)
        .attr("width", 37)
        .attr("height", 37)
        .attr("stroke", "black")
        .attr("fill", this.rectColors.low);
      gScale.append("rect")
        .attr("x", 0)
        .attr("y", 37)
        .attr("width", 37)
        .attr("height", 37)
        .attr("stroke", "black")
        .attr("fill", this.rectColors.mid);
    },
  },
};
</script>

<style scoped>
.invest_style_box {
  position: relative;
  height: 175px;
  width: 180px;
  /* border: 1px solid black; */
  margin-top: 5px;
  margin-left: 45px;
  flex-shrink: 0;
  z-index: 2;
  background-color: white;
}

.text {
  position: absolute;
  width: 172px;
  height: 20px;
  text-align: center;
  font-size: 13px;
}

.content {
  position: absolute;
  height: 151px;
  width: 152px;
  /* border: 1px solid black; */
  top: 20px;
}

#up_icons {
  position: absolute;
  height: 20px;
  width: 111px;
  /* border: 1px solid black; */
  top: 20px;
  left: 40px;
}

#down_icons {
  position: absolute;
  height: 20px;
  width: 111px;
  /* border: 1px solid black; */
  top: 151px;
  left: 40px;
}

#right_icons {
  position: absolute;
  height: 111px;
  width: 20px;
  /* border: 1px solid black; */
  top: 40px;
  left: 151px;
}
</style>