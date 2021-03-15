<template>
  <a-row class="first_row">
    <MarketAnalysisCurveChart v-on:updateBrush="handleUpdateBrush" />
  </a-row>
  <a-row class="second_row">
    <a-row type="flex" class="industry_selection_style">
      <svg class="icon menu_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>

      <text>Industry Selection</text>
    </a-row>
    <MarketAnalysisStramGraph />
  </a-row>
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
  width: 100%;
  height: 30.9%;
  /* border: 1px solid black; */
  text-align: center;
}

.first_row {
  height: 307px;
  width: 100%;
  border: 1px solid red;
}
.second_row {
  /* border-top: 1px solid black; */
  height: 380px;
  width: 100%;
  /* border: 1px solid red; */
  /* transform: rotate(-90deg); */
  background: #ffffff;
  box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05);
}

.industry_selection_style{
  margin-top: 3%;
  margin-bottom: 1%;
}
.industry_selection_style text {
  font-family: "PingFangSC-Semibold";
  font-size: 19px;
  height: 32px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  margin-left: 25px;
}
.industry_selection_style .menu_icon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
  left: 20px;
}
.menuIcon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
}
</style>