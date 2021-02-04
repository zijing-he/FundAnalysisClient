<template>
  <div class="container">
    <h4>基金市场的演变</h4>
    <MarketAnalysisCurveChart />
    <MarketAnalysisStramGraph />
  </div>
</template>
<script>
import MarketAnalysisCurveChart from "@/components/MarketAnalysis/market-analysis-curvechart";
import MarketAnalysisStramGraph from "@/components/MarketAnalysis/market-analysis-streamgraph";
export default {
  name: "MarketAnalysisLayout",
  data() {
    return {};
  },
  components: {
    MarketAnalysisCurveChart,
    MarketAnalysisStramGraph
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 175px;
  width: 100%;
  border: 1px solid black;
  position: absolute;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
}
</style>