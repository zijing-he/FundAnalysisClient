<template>
  <a-row :gutter="8">
    <a-col :span="18">
      <div class="gutter-box">
        <OverView/>
        <!-- <MarketLayout></MarketLayout> -->
      </div>
    </a-col>
    <a-col :span="6">
      <div class="gutter-box">
        <div class="sidebar">收益对比</div>
        <div class="sidebar">风险对比</div>
        <div class="sidebar">规模对比</div>
        <div class="sidebar">持仓分布</div>
      </div>
    </a-col>
  </a-row>
  
  <!-- <ManagerLayout/> -->
  <!--    <FundLayout/>-->
  <!--    <CompanyLayout/>-->
</template>

<script>
import OverView from "@/components/Overview/overView";
// import MarketLayout from "@/components/Market/market-layout";
// import ManagerLayout from "@/components/Manager/manager-layout";
// import FundLayout from "@/components/Fund/FundLayout";
// import CompanyLayout from "@/components/Company/CompanyLayout";

export default {
  name: "App",
  components: {
    OverView,
    // MarketLayout,
    // ManagerLayout,
    // FundLayout,
    // CompanyLayout
  },
  mounted() {},
};
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

.sidebar{
  width:100%;
  height: 223px;
  
  border: 1px solid lightblue;
}
</style>
