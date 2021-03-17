<template>
  <div class="container">
    <a-row class="fund_manager_text">
      <svg class="icon fund_manager_text_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Fund Manager</text>
    </a-row>
    <!-- <div class="inner_container"> -->

    <!-- <div class="manager_bubble_chart_container" v-if="!isRequesting">
        <managerBubbleChart
          :fundManagers="managers"
          v-on:showManager="handleShowManager"
        />
      </div> -->
    <a-row>
      <a-spin
        v-if="isRequesting"
        size="large"
        tip="Loading..."
        style="margin:60px 0 60px 770px"
      />
      <div class="fund_manager_container" v-if="!isRequesting">
        <managerBubbleChart
          :fundManagers="managers"
          v-on:showManager="handleShowManager"
        />
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
      </div>
    </a-row>
  </div>
</template>

<script>
import fundBubbleChart from "@/components/Overview/fund-bubble-chart.vue";
import managerBubbleChart from "@/components/Overview/manager-bubble-chart";

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
      managerFunds: undefined,
      isRequesting: true,
    };
  },
  components: {
    fundBubbleChart,
    managerBubbleChart,
  },
  watch: {
    fundsData: function () {
      // console.log(this.fundsData);
      this.isRequesting = true;
      this.managers = this.fundsData.managers;
      this.funds = this.fundsData.funds;
      this.managerFunds = this.fundsData.manager_funds;
      this.isRequesting = false;
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
  margin-left: 28px;
  width: 1660px;
  /* border: 1px solid red; */
  background: #ffffff;
  border-radius: 15px;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
  box-shadow: 2px 4px 12px 0px rgba(0, 0, 0, 0.4);
}

.inner_container {
  display: flex;
  justify-content: center;
}
.fund_bubble_chart_outer_container {
  /* position: absolute; */
  display: flex;
  width: 1400px;
  overflow-x: visible;
  overflow-y: hidden;
  margin-bottom: 10px;
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

.fund_manager_text {
  margin-top: 15px;
  margin-bottom: 5px;
}
.fund_manager_text text {
  font-family: "PingFangSC-Semibold";
  font-size: 19px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  margin-left: 25px;
}
.fund_manager_text .fund_manager_text_icon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
  left: 20px;
}

.fund_manager_container {
  display: flex;
  justify-content: flex-start;
}
</style>
