<template>
  <div class="container">
    <text>Market panel</text>
    <a-row class="first_row">
      <MarketAnalysisCurveChart v-on:updateBrush="handleUpdateBrush" />
    </a-row>
    <a-row class="second_row">
      <a-row type="flex" class="icon_text">
        <a-col :span="10">
          <svg class="icon menuIcon" aria-hidden="true">
            <use xlink:href="#iconxitongcaidan"></use>
          </svg>
        </a-col>
        <a-col :span="14">
          <text>Industry Selection</text>
        </a-col>
      </a-row>
      <MarketAnalysisStramGraph />
    </a-row>
  </div>
</template>
<script>
import MarketAnalysisCurveChart from "@/components/MarketAnalysis/curvechart";
import MarketAnalysisStramGraph from "@/components/MarketAnalysis/streamgraph";
export default {
  name: "MarketAnalysisLayout",
  data() {
    return {};
  },
  components: {
    MarketAnalysisCurveChart,
    MarketAnalysisStramGraph,
  },
  methods: {
    handleUpdateBrush(start, end) {
      this.$emit("updateTimeBoundary", start, end);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 10px;
  width: 100%;
  height: 100%;
  /* border: 1px solid black; */
  text-align: center;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
.inner_container {
  display: flex;
}
.second_row {
  position: relative;
  margin-top: 20px;
  /* border-top: 1px solid black; */
  height: 30.9%;
  width: 100%;
  /* border: 1px solid red; */
  /* transform: rotate(-90deg); */
  background: #ffffff;
  box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05);
}
.icon_text {
  margin-top: 3.5%;

  margin-bottom: 4.83%;
}
.second_row text {
  font-family: PingFangSC-Semibold;
  font-size: 19px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  white-space: nowrap;
  text-align: center;
  margin-left: -9%;
}

.menuIcon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
}
</style>