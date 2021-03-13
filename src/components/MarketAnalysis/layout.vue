<template>
  <div class="container">
    <text>Market panel</text>
    <a-row class="first_row">
      <MarketAnalysisCurveChart v-on:updateBrush="handleUpdateBrush" />
    </a-row>
    <a-row class="second_row">
      <text>Industry Panel</text>
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
  margin-top: 20px;
  border-top: 1px solid black;
  width: 100%;
  text-align: center;
  font-size:18px;
  font-weight: bold;
}
.second_row text{
  width:100%;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;


}

</style>