<template>
  <div class="container">
    <h2>基金市场的演变</h2>
    <MarketAnalysis />
  </div>
</template>
<script>
import MarketAnalysis from "@/components/MarketAnalysis/market-analysis";
export default {
  name: "MarketAnalysisLayout",
  data() {
    return {};
  },
  components: {
    MarketAnalysis,
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 200px;
  width: 100%;
  border: 2px solid black;
}
.container h2 {
  border-bottom: 2px solid black;
  margin-bottom: 0;
}
</style>