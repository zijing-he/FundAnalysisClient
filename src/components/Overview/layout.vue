<template>
  <div class="container">
    <a-row type="flex" justify="center">
      <text>历史数据对比</text>
    </a-row>
    <!-- <div class="inner_container"> -->
    <!-- <a-spin
        v-if="isRequesting"
        size="large"
        tip="Loading..."
        style="margin-top: 89.3px; margin-bottom: 89.3px"
      /> -->
    <!-- <div class="manager_bubble_chart_container" v-if="!isRequesting">
        <managerBubbleChart
          :fundManagers="managers"
          v-on:showManager="handleShowManager"
        />
      </div> -->
    <a-row>
      <div class="fund_bubble_chart_outer_container" v-if="!isRequesting">
        <fundBubbleChart
          :quarterFundData="val"
          :fundManagers="managers"
          :managerGruop="managerFunds[key]"
          :date="key"
          :key="key"
          v-for="(val, key) in funds"
        >
        </fundBubbleChart>
      </div>
      <!-- </div> -->
    </a-row>
  </div>
</template>

<script>
import fundBubbleChart from "@/components/Overview/fund-bubble-chart.vue";
// import managerBubbleChart from "@/components/Overview/manager-bubble-chart";

export default {
  name: "OverViewLayout",
  props: {
    fundsData: Object,
    totalWidth: Number,
    scrollLeft: Number,
  },
  data() {
    return {
      componentName: fundBubbleChart,
      managers: null,
      funds: null,
      mangerId: undefined,
      managerFunds:undefined,
      isRequesting: false,
    };
  },
  components: {
    fundBubbleChart,
    // managerBubbleChart,
  },
  watch: {
    fundsData: function () {
      // console.log(this.fundsData);
      // this.isRequesting = true;
      this.managers = this.fundsData.managers;
      this.funds = this.fundsData.funds;
      this.managerFunds = this.fundsData.manager_funds;
      // this.isRequesting = false;
    },
  },
  methods: {
    // handleShowManager(mangerId) {
    //   this.mangerId = mangerId;
    // },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  width: 100%;
  border: 1px solid black;
}
text {
  border-bottom: 1px solid black;
  width: 100%;
  /* margin-bottom: 0; */
  font-weight: bold;
}
.inner_container {
  display: flex;
  justify-content: center;
}
.fund_bubble_chart_outer_container {
  /* position: absolute; */
  display: flex;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border-right: 1px solid black;
}
.manager_bubble_chart_container {
  width: 15%;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  height: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
