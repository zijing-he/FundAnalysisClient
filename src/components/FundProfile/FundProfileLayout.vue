<template>
  <div class="container">
    <component :is="componentName"
      :fundId="item"
      :key="item"
      :alphaData="alphaData"
      :betaData="betaData"
      :sharpData="sharpData"
      v-for="item in fundIds">
    </component>
  </div>
</template>
<script>
import FundProfile from "@/components/FundProfile/FundProfile";
export default {
  name: "FundProfileLayout",
  data() {
    return {
      componentName: "FundProfile",
      fundIds: ["000001", "000006", "000011", "000020"],
      alphaData: [],
      betaData: [],
      sharpData: [],
    };
  },
  components: {
    FundProfile,
  },
  methods: {},
  mounted() {
    this.fundIds.forEach(d => {
      const fundData = require(`@/data/FundProfile/${d}.json`);
      const keys = Object.keys(fundData);
      this.alphaData.push(fundData[keys[keys.length - 1]]["alpha"]);
      this.betaData.push(fundData[keys[keys.length - 1]]["beta"]);
      this.sharpData.push(fundData[keys[keys.length - 1]]["sharp_ratio"]);
    });
  },
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  width: 100%;
  border: 1px solid black;
}
</style>