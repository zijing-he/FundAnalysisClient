<template>
  <div class="container">
    <h4>基金市场的演变</h4>
    <a-row>
      <a-col :span="12">
        <MarketAnalysisCurveChart v-on:updateBrush="handleUpdateBrush" />
      </a-col>
      <a-col :span="12">
        <MarketAnalysisStramGraph />
      </a-col>
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
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
.inner_container {
  display: flex;
}
</style>