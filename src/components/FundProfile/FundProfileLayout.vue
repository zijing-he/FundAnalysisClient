<template>
  <div class="container">
    <component :is="componentName"
      :fundId="item"
      :key="item"
      :returnData="returnData"
      :carData="carData"
      :stockData="stockData"
      :bondData="bondData"
      :cashData="cashData"
      :otherData="otherData"
      :avgSizeData="sizeData"
      :alphaData="alphaData"
      :betaData="betaData"
      :sharpData="sharpData"
      :dropData="dropData"
      :infoData="infoData"
      :riskData="riskData"
      :weightData="weightData"
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
      fundIds: ["000001", "000006", "000011", "000020", "000021", "000029", "000031", "000039", "000059"],
      returnData: [],
      carData: [],
      stockData: [],
      bondData: [],
      cashData: [],
      otherData: [],
      sizeData: [],
      alphaData: [],
      betaData: [],
      sharpData: [],
      dropData: [],
      infoData: [],
      riskData: [],
      weightData: [],
    };
  },
  components: {
    FundProfile,
  },
  methods: {},
  mounted() {
    this.fundIds.forEach(d => {
      const fundData = require(`@/data/FundProfile/${d}.json`);
      this.returnData.push(fundData["total"][d]["return"]);
      this.carData.push(fundData["total"][d]["car"]);
      this.stockData.push(fundData["total"][d]["stock"]);
      this.bondData.push(fundData["total"][d]["bond"]);
      this.cashData.push(fundData["total"][d]["cash"]);
      this.otherData.push(fundData["total"][d]["other"]);
      this.sizeData.push(fundData["total"][d]["size"]);
      this.alphaData.push(fundData["total"][d]["alpha"]);
      this.betaData.push(fundData["total"][d]["beta"]);
      this.sharpData.push(fundData["total"][d]["sharp_ratio"]);
      this.dropData.push(fundData["total"][d]["max_drop_down"]);
      this.infoData.push(fundData["total"][d]["information_ratio"]);
      this.riskData.push(fundData["total"][d]["risk"]);
      this.weightData.push(fundData["total"][d]["instl_weight"]);
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