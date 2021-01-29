<template>
  <div class="container">
    <h3>基金市场的演变</h3>
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
  height: 270px;
  width: 100%;
  border: 2px solid black;
}
.container h3 {
  border-bottom: 2px solid black;
  margin-bottom: 0;
}
</style>