<template>
  <div id="app">
    <h1>总对比图</h1>
    <MarketLayout></MarketLayout>
    <ManagerLayout></ManagerLayout>
<!--    <FundLayout/>-->
<!--    <CompanyLayout/>-->
  </div>
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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
