<template>
  <a-row :gutter="8">
    <a-col :span="12">
      <div class="gutter-box">
        <MarketLayout></MarketLayout>
      </div>
    </a-col>
    <a-col :span="12">
      <div class="gutter-box">
        <ManagerLayout></ManagerLayout>
      </div>
    </a-col>
  </a-row>
  <!--    <FundLayout/>-->
  <!--    <CompanyLayout/>-->
</template>

<script>
import MarketLayout from "@/components/Market/market-layout";
import ManagerLayout from "@/components/Manager/manager-layout";
// import FundLayout from "@/components/Fund/FundLayout";
// import CompanyLayout from "@/components/Company/CompanyLayout";

export default {
  name: 'App',
  components: {
    MarketLayout,
    ManagerLayout,
    // FundLayout,
    // CompanyLayout
  },
  mounted () {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 1600px;
  height: 900px;
  margin: 10px;
  border: 2px solid lightblue;
}

.gutter-box {
  border: 1px solid lightseagreen;
  padding: 5px 0;
}
</style>
