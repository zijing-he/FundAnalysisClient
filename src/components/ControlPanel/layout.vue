<template>
  <div class="topContainer">
    <h4>投资风格面板</h4>
    <a-row type="flex" align="middle">
      <a-col :span="20">
        <ControlPanelRaderChart v-on:updateUserData="updateList" />
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="handleClick">提交</a-button>
      </a-col>
    </a-row>
    <!-- <a-row class="sectror_ontainer">
      <text class="text">关注行业：</text>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconbaijiu_duose_"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconxinnengyuankaifa"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconyinhang"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon55-fangdichandaikuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icontesila"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconmeitanjianguanqu"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconshipin"></use>
      </svg>
    </a-row> -->
  </div>
  <div class="bottomContainer">
    <sortedList :list="sortedList" v-on:updateFundId="handleUpdateFundId" />
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
import SortedList from "@/components/ControlPanel/sorted-list";
import DataService from "@/utils/data-service";

export default {
  name: "ControlPanelLayout",
  props: {
    start_date: String,
    end_date: String,
  },
  data() {
    return {
      //默认值
      weight: {
        size: "0.5000",
        instl_weight: "0.5000",
        alpha: "0.5000",
        beta: "0.5000",
        sharp_ratio: "0.5000",
        max_drop_down: "0.5000",
        information_ratio: "0.5000",
        risk: "0.5000",
        one_quarter_return: "0.5000",
        one_year_return: "0.5000",
        three_year_return: "0.5000",
        one_quarter_car: "0.5000",
        one_year_car: "0.5000",
        three_year_car: "0.5000",
      },
      sortedList: null,
      userWeight: null,
    };
  },
  emits: ["updateWeightsAndId"],
  components: {
    ControlPanelRaderChart,
    SortedList,
  },
  methods: {
    handleClick() {
      //点击传值
      DataService.post(
        "get_fund_ranks",
        {
          weights: this.weight,
          start_date: this.start_date,
          end_date: this.end_date,
        },
        (data) => {
          this.sortedList = data.ranks.slice(0, 10);
        }
      );

      this.userWeight = this.weight;
    },
    updateList(userWeight) {
      // 返回排序结果
      this.weight = userWeight;
    },

    handleUpdateFundId(fundsId) {
      this.$emit("updateWeightsAndId", fundsId, this.userWeight);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.topContainer {
  /* height: 300px; */
  width: 100%;
  border: 1px solid black;
}
.topContainer h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0px;
  font-weight: bold;
}
.sectror_ontainer {
  margin-top: -0.5em;
  margin-left: 1em;
}

.text {
  font-size: 13px;
}

.bottomContainer {
  width: 100%;
  height: 76%;
  margin-top: 5px;
  border: 1px solid black;
}

/* 
.icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.2em;
  margin-right: 0.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
} */
</style>