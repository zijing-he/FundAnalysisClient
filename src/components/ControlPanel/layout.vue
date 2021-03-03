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
    <sortedList />
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
import SortedList from "@/components/ControlPanel/sorted-list";
import DataService from "@/utils/data-service";

export default {
  name: "ControlPanelLayout",
  data() {
    return {
      list: [],
      sortedList: null,
    };
  },
  components: {
    ControlPanelRaderChart,
    SortedList,
  },
  methods: {
    handleClick() {
      console.log("返回排序结果");
      DataService.post("get_fund_ranks", { weights: this.list }, (data) => {
        this.sortedList = data.ranks.slice(0, 10);
        console.log(this.sortedList);
      });
    },
    updateList(value) {
      this.list = value;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.topContainer {
  height: 255px;
  width: 100%;
  border: 1px solid black;
}
.topContainer h4 {
  border-bottom: 1px solid black;
  margin-bottom: 5px;
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
  margin-top: 10px;
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