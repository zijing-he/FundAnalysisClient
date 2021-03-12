<template>
  <div class="topContainer">
    <h4>View</h4>
    <a-row type="flex" align="middle" :gutter="[8, 32]">
      <a-col :span="4">
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">
                <UserOutlined />
                保守型
              </a-menu-item>
              <a-menu-item key="2">
                <UserOutlined />
                稳健型
              </a-menu-item>
              <a-menu-item key="3">
                <UserOutlined />
                激进型
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            用户类型
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-col>
      <a-col :span="20">
        <ControlPanelRaderChart
          v-on:updateUserData="updateList"
          :proData="data"
        />
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" :gutter="[8, 32]">
      <a-col :span="24">
        <a-button
          type="primary"
          @click="handleClick"
          style="margin-left: 60px; margin-bottom: 10px"
          >更新权重</a-button
        >
      </a-col>
    </a-row>
  </div>
  <!-- <div class="bottomContainer">
    <sortedList :list="sortedList" v-on:updateFundId="handleUpdateFundId" />
  </div> -->
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
// import SortedList from "@/components/SortedList/sorted-list";
import DataService from "@/utils/data-service";
import { UserOutlined, DownOutlined } from "@ant-design/icons-vue";

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
      data: [
        { axis: "size", value: 2.5 },
        { axis: "instl_weight", value: 2.5 },
        { axis: "alpha", value: 2.5 },
        { axis: "beta", value: 2.5 },
        { axis: "sharp_ratio", value: 2.5 },
        { axis: "max_drop_down", value: 2.5 },
        { axis: "information_ratio", value: 2.5 },
        { axis: "risk", value: 2.5 },
        { axis: "one_quarter_return", value: 2.5 },
        { axis: "one_year_return", value: 2.5 },
        { axis: "three_year_return", value: 2.5 },
        { axis: "one_quarter_car", value: 2.5 },
        { axis: "one_year_car", value: 2.5 },
        { axis: "three_year_car", value: 2.5 },
      ],
    };
  },
  emits: ["updateWeightsAndId"],
  components: {
    ControlPanelRaderChart,
    UserOutlined,
    DownOutlined,
    // SortedList,
  },
  methods: {
    handleMenuClick(d) {
      if (d.key == 1) {
        this.weight = {
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
        };
        this.data = [
          { axis: "size", value: 2.5 },
          { axis: "instl_weight", value: 2.5 },
          { axis: "alpha", value: 2.5 },
          { axis: "beta", value: 2.5 },
          { axis: "sharp_ratio", value: 2.5 },
          { axis: "max_drop_down", value: 2.5 },
          { axis: "information_ratio", value: 2.5 },
          { axis: "risk", value: 2.5 },
          { axis: "one_quarter_return", value: 2.5 },
          { axis: "one_year_return", value: 2.5 },
          { axis: "three_year_return", value: 2.5 },
          { axis: "one_quarter_car", value: 2.5 },
          { axis: "one_year_car", value: 2.5 },
          { axis: "three_year_car", value: 2.5 },
        ];
      } else if (d.key == 2) {
        this.weight = {
          size: "0.7",
          instl_weight: "0.7",
          alpha: "0.7",
          beta: "0.55",
          sharp_ratio: "0.3",
          max_drop_down: "0.2",
          information_ratio: "0.6",
          risk: "0.6",
          one_quarter_return: "0.6",
          one_year_return: "0.6",
          three_year_return: "0.6",
          one_quarter_car: "0.6",
          one_year_car: "0.8",
          three_year_car: "0.8",
        };
        this.data = [
          { axis: "size", value: 2.7 },
          { axis: "instl_weight", value: 2.7 },
          { axis: "alpha", value: 2.7 },
          { axis: "beta", value: 2.57 },
          { axis: "sharp_ratio", value: 2.3 },
          { axis: "max_drop_down", value: 2.2 },
          { axis: "information_ratio", value: 2.6 },
          { axis: "risk", value: 2.6 },
          { axis: "one_quarter_return", value: 2.6 },
          { axis: "one_year_return", value: 2.6 },
          { axis: "three_year_return", value: 2.6 },
          { axis: "one_quarter_car", value: 2.6 },
          { axis: "one_year_car", value: 2.8 },
          { axis: "three_year_car", value: 2.8 },
        ];
      } else if (d.key == 3) {
        this.weight = {
          size: "1",
          instl_weight: "1",
          alpha: "1",
          beta: "1",
          sharp_ratio: "1",
          max_drop_down: "1",
          information_ratio: "1",
          risk: "1",
          one_quarter_return: "1",
          one_year_return: "1",
          three_year_return: "1",
          one_quarter_car: "1",
          one_year_car: "1",
          three_year_car: "1",
        };
        this.data = [
          { axis: "size", value: 3 },
          { axis: "instl_weight", value: 3 },
          { axis: "alpha", value: 3 },
          { axis: "beta", value: 3 },
          { axis: "sharp_ratio", value: 3 },
          { axis: "max_drop_down", value: 3 },
          { axis: "information_ratio", value: 3 },
          { axis: "risk", value: 3 },
          { axis: "one_quarter_return", value: 3 },
          { axis: "one_year_return", value: 3 },
          { axis: "three_year_return", value: 3 },
          { axis: "one_quarter_car", value: 3 },
          { axis: "one_year_car", value: 3 },
          { axis: "three_year_car", value: 3 },
        ];
      }
    },
    handleClick() {
      //点击传值
      // DataService.post(
      //   "get_fund_ranks",
      //   {
      //     weights: this.weight,
      //     start_date: this.start_date,
      //     end_date: this.end_date,
      //   },
      //   (data) => {
      //     this.sortedList = data.ranks.slice(0, 10);
      //   }
      // );

      this.userWeight = this.weight;
      this.$emit("updateSortedList", this.userWeight);
    },
    updateList(userWeight) {
      // 返回排序结果
      this.weight = userWeight;
    },

    // handleUpdateFundId(fundsId) {
    //   this.$emit("updateWeightsAndId", fundsId, this.userWeight);
    // },
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
</style>