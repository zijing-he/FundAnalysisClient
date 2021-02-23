<template>
  <div class="container">
    <h4>基金市场的演变</h4>
    <MarketAnalysisCurveChart />
    <MarketAnalysisStramGraph />
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
    MarketAnalysisStramGraph
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 35%;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
</style>