<template>
  <div class="container">
    <!-- <a-row class="fund_manager_text">
      <svg class="icon fund_manager_text_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Fund Manager</text>
    </a-row> -->
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
        style="margin: 70px 0 70px 770px"
      />
      <div class="fund_manager_container" v-if="!isRequesting">
        <managerBubbleChart
          :fundManagers="managers"
          :selectedManager="selectedManager"
          :isRefresh="isRefresh"
          v-on:showManager="handleShowManager"
        />
        <div
          ref="fund_bubble_container"
          class="fund_bubble_chart_outer_container"
          @scroll="handleScroll()"
          :style="autoWidth"
          v-if="!isRequesting"
        >
          <div id="title_container"><text>Management Graph</text></div>
          <fundPieChart
            :quarterFundData="val"
            :fundManagers="managers"
            :showManagerId="mangerId"
            :showManagerIdLength="mangerIdLength"
            :reFresh="reFresh"
            :managerGruop="managerFunds[key]"
            :date="key"
            :key="key"
            :marginLeft="marginLeftArray[index]"
            v-for="(val, key, index) in funds"
          >
          </fundPieChart>
          <!-- <fundBubbleChart
            :quarterFundData="val"
            :fundManagers="managers"
            :showManagerId="mangerId"
            :showManagerIdLength="mangerIdLength"
            :managerGruop="managerFunds[key]"
            :date="key"
            :key="key"
            :marginLeft="marginLeftArray[index]"
            v-for="(val, key, index) in funds"
          >
          </fundBubbleChart> -->
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
// import fundBubbleChart from "@/components/Overview/fund-bubble-chart.vue";
import fundPieChart from "@/components/Overview/fund-pie-chart.vue";
import managerBubbleChart from "@/components/Overview/manager-bubble-chart";

export default {
  name: "OverViewLayout",
  props: {
    fundsData: Object,
    totalWidth: Number,
    scrollLeft: Number,
    marginLeft: Array,
    selectedManager: Array,
    isRefresh: Number,
  },
  data() {
    return {
      managers: null,
      funds: null,
      mangerId: null,
      managerFunds: undefined,
      isRequesting: true,
      marginLeftArray: null,
      mangerIdLength: 0,
      reFresh: 0,
    };
  },
  components: {
    // fundBubbleChart,
    fundPieChart,
    managerBubbleChart,
  },
  watch: {
    fundsData: function() {
      this.isRequesting = true;
      // console.log("fundsData:", this.fundsData);
      this.mangerId = []; //每次要清空
      this.mangerIdLength = 0;
      this.managers = this.fundsData.managers; //经理的位置与颜色
      this.funds = this.fundsData.funds; //多个季度基金的位置
      this.managerFunds = this.fundsData.manager_funds; //每个经理手下的基金
      this.marginLeftArray = this.marginLeft;
      // console.log("marginLeftArray:",this.marginLeftArray);
      if (this.marginLeftArray) {
        this.isRequesting = false;
      }
    },
    scrollLeft: function(value) {
      this.$refs.fund_bubble_container.scrollLeft = value;
    },
  },
  emits: ["updateScroll"],
  computed: {
    autoWidth() {
      const style = {};
      style.width = this.totalWidth + "px"; //每个都是svg的，需要container宽度比较小，才可以出现滚动轴
      return style;
    },
  },
  methods: {
    handleShowManager(mangerId, arrLength) {
      // console.log("有变化：",mangerId,arrLength);
      this.mangerId = mangerId;
      this.mangerIdLength = arrLength;
      ++this.reFresh;
    },
    handleScroll() {
      // console.log("滑动轴数值：", this.$refs.fund_bubble_container.scrollLeft);
      this.$emit("updateScroll", this.$refs.fund_bubble_container.scrollLeft);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 44px;
  margin-left: 30px;
  margin-right: 36px;
  width: calc(100% - 30px);
  /* border: 1px solid red; */
  background: #ffffff;
  border-radius: 8px;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.inner_container {
  display: flex;
  justify-content: center;
}
.fund_bubble_chart_outer_container {
  position: relative;

  /* width: 1300px; */
  max-width: 1400px;
  /* margin-left:100px; */
  /* border: 1px solid #ccc; */
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  /* margin-bottom: 10px; */
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

#title_container {
  position: absolute;
  left: 10px;
}

#title_container text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  font-weight: 600;
  /* line-height: 32px; */
  color: #4b4b4b;
  letter-spacing: -0.22px;
  text-align: right;
}
</style>
