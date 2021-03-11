<template>
  <div class="container">
    <h4>历史数据对比</h4>
    <div class="inner_container">
      <a-spin
        v-if="isRequesting"
        size="large"
        tip="Loading..."
        style="margin-top: 89.3px; margin-bottom: 89.3px"
      />
      <div class="fund_bubble_chart_outer_container" v-if="!isRequesting">
        <fundBubbleChart
          :quarterFundData="val"
          :fundManagers="managers"
          :mangerId="mangerId"
          :date="key"
          :key="key"
          v-for="(val, key) in funds"
        >
        </fundBubbleChart>
      </div>
      <div class="manager_bubble_chart_container" v-if="!isRequesting">
        <managerBubbleChart
          :fundManagers="managers"
          v-on:showManager="handleShowManager"
        />
      </div>
    </div>
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
      isRequesting: true,
    };
  },
  components: {
    fundBubbleChart,
    managerBubbleChart,
  },
  watch: {
    fundsData: function () {
      this.isRequesting = true;
      this.managers = this.fundsData.managers;
      this.funds = this.fundsData.funds;
      this.isRequesting = false;
    },
  },
  methods: {
    handleShowManager(mangerId) {
      this.mangerId = mangerId;
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
h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
.inner_container {
  display: flex;
  justify-content: center;
}
.fund_bubble_chart_outer_container {
  /* position: absolute; */
  display: flex;
  width: 80%;
  overflow-x: auto;
  overflow-y: hidden;
  border-right: 1px solid black;
}
.manager_bubble_chart_container {
  width: 20%;
}
</style>
