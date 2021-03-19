<template>
  <div class="container">
    <a-row class="control_panel">
      <svg class="icon control_icon" aria-hidden="true">
        <use xlink:href="#iconcontrol"></use>
      </svg>
      <text>Control Panel</text>
    </a-row>
    <a-row class="investment_style">
      <svg class="icon menu_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Investment Style</text>
    </a-row>

    <a-row class="custormer_type">
      <text id="custormer_type_text">Custormer Type</text>
      <!-- <a-dropdown>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">
              <UserOutlined />
              <text class="menu_item_text">Conservative Investor</text>
            </a-menu-item>
            <a-menu-item key="2">
              <UserOutlined />
              <text class="menu_item_text">Robust Investor</text>
            </a-menu-item>
            <a-menu-item key="3">
              <UserOutlined />
              <text class="menu_item_text">Radical Investor</text>
            </a-menu-item>
          </a-menu>
        </template>
        <a-button class="dropdown_button">
          <text>Conservative Investor</text>
          <DownOutlined class="dropdown_button_downicon" />
        </a-button>
      </a-dropdown> -->

      <select id="select_container" @change="handleMenuClick">
        <option value="1">Conservative Investor</option>
        <option value="2">Robust Investor</option>
        <option value="3">Radical Investor</option>
      </select>
    </a-row>
    <a-row id="divider"></a-row>
    <a-row>
      <text id="weight_adjustment_text">Weight Adjustment</text>
    </a-row>
    <a-row class="rader_chart_container">
      <ControlPanelRaderChart
        v-on:updateUserData="handleUpdateUserData"
        :proData="data"
      />
    </a-row>
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
import { UserOutlined, DownOutlined } from "@ant-design/icons-vue";
export default {
  name: "ControlPanelLayout",
  props: {
    weights: Object,
  },
  data() {
    return {
      //默认值
      weight:
        // {
        //   size: "0.5000",
        //   three_year_return: "0.5000",
        //   one_year_return: "0.5000",
        //   one_quarter_return: "0.5000",
        //   beta: "0.5000",
        //   alpha: "0.5000",
        //   sharp_ratio: "0.5000",
        //   instl_weight: "0.5000",
        //   risk: "0.5000",
        //   information_ratio: "0.5000",
        //   max_drop_down: "0.5000",
        //   one_quarter_car: "0.5000",
        //   three_year_car: "0.5000",
        //   one_year_car: "0.5000",
        // },
        {
          one_quarter_return: "1.0",
          one_year_return: "1.0",
          three_year_return: "1.0",
          max_drop_down: "0.0",
          risk: "1.0",
          sharp_ratio: "0.0",
          information_ratio: "0.0",
          alpha: "0.0",
          beta: "0.0",
          size: "1.0",
          // instl_weight: "0.0",
        },
      data: [
        { axis: "one_quarter_return", value: 3 },
        { axis: "one_year_return", value: 3 },
        { axis: "three_year_return", value: 3 },
        { axis: "max_drop_down", value: 2 },
        { axis: "risk", value: 3 },
        { axis: "sharp_ratio", value: 2 },
        { axis: "information_ratio", value: 2 },
        { axis: "alpha", value: 2 },
        { axis: "beta", value: 2 },
        { axis: "size", value: 3 },
        // { axis: "instl_weight", value: 2 },
      ],
    };
  },
  watch: {
    //基金画像更新权重
    weights: function (value) {
      if (value) {
        this.weight = value;
        this.handleWeightToData();
      }
    },
  },

  emits: ["updateFundWeight"],
  components: {
    ControlPanelRaderChart,
    // UserOutlined,
    // DownOutlined,
  },
  methods: {
    handleMenuClick(d) {
      if (d.target.value == 1) {
        this.weight = {
          one_quarter_return: "1.0",
          one_year_return: "1.0",
          three_year_return: "1.0",
          max_drop_down: "0.0",
          risk: "1.0",
          sharp_ratio: "0.0",
          information_ratio: "0.0",
          alpha: "0.0",
          beta: "0.0",
          size: "1.0",
          // instl_weight: "0.0",
        };
      } else if (d.target.value == 2) {
        this.weight = {
          one_quarter_return: "0",
          one_year_return: "0.4",
          three_year_return: "0.8",
          max_drop_down: "-1",
          risk: "-1",
          sharp_ratio: "0.3",
          information_ratio: "0.4",
          alpha: "0.3",
          beta: "0.2",
          size: "1.0",
          // instl_weight: "0.2",
        };
      } else if (d.target.value == 3) {
        this.weight = {
          one_quarter_return: "1.0",
          one_year_return: "1.0",
          three_year_return: "1.0",
          max_drop_down: "1",
          risk: "1.0",
          sharp_ratio: "1.0",
          information_ratio: "0.4",
          alpha: "1",
          beta: "1",
          size: "0",
          // instl_weight: "0.0",
        };
      }
      this.handleWeightToData();
      this.$emit("updateFundWeight", this.weight); //选完类型后，将权重更新到app
    },
    handleUpdateUserData(userWeight) {
      // 返回排序结果
      this.weight = userWeight;
      this.$emit("updateFundWeight", this.weight); //拖动后，将权重更新到app
    },
    //将权重转化为数组，为了画雷达图
    handleWeightToData() {
      let tempData = [];
      for (let key in this.weight) {
        tempData.push({
          axis: `${key}`,
          value: parseFloat(this.weight[key]) + 2, //注意位数和是否传了字符串，+2为了画图
        });
      }
      this.data = JSON.parse(JSON.stringify(tempData)); //深拷贝，给散点图的id
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 529px;
  width: 523px;
  background: #ffffff;
  box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05);
}
/* 从这里开始放新的样式 */

.control_panel {
  background: #011f41;
  box-shadow: 1px -3px 4px 0 rgba(36, 15, 57, 0.1);
}

.control_panel text {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #d0dde7;
  letter-spacing: 0;
  margin-left: 25px;
}

.control_panel .control_icon {
  position: relative;
  font-size: 19px;
  top: 3px;
  left: 22px;
}
.investment_style {
  margin-top: 5px;
  margin-bottom: 5px;
}
.investment_style text {
  font-family: "PingFangSC-Semibold";
  font-size: 19px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  margin-left: 25px;
}
.investment_style .menu_icon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
  left: 20px;
}
.custormer_type {
  margin-bottom: 10px;
  /* border: 1px solid #DEDEDE; */
}
.custormer_type #custormer_type_text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  font-weight: 600;
  line-height: 32px;
  color: #4b4b4b;
  letter-spacing: -0.22px;
  text-align: right;
  margin-left: 28px;
}
#weight_adjustment_text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  font-weight: 600;
  line-height: 32px;
  color: #4b4b4b;
  letter-spacing: -0.22px;
  text-align: right;
  margin-left: 28px;
  margin-top: 10px;
}
.custormer_type .dropdown_button {
  text-align: left;
  margin-left: 30px;
  width: 300px;
  border: 1px solid #aeaeae;
  box-shadow: 0 20px 15px -12px rgba(21, 85, 194, 0.13);
  border-radius: 5px;
}
.custormer_type .dropdown_button text {
  font-family: "PingFangSC-Semibold";
  font-size: 13px;
  color: #9c9c9c;
  letter-spacing: 0.3px;
  line-height: 32px;
}
.custormer_type .dropdown_button .dropdown_button_downicon {
  margin-left: 120px;
  color: #aeaeae;
}
.menu_item_text {
  font-family: "PingFangSC-Semibold";
  font-size: 13px;
  color: #4b4b4b;
  letter-spacing: 0.3px;
  line-height: 32px;
}
#divider {
  margin: auto;
  width: 89%;
  /* height: 1px; */
  border-bottom: 1px solid #dedede;
}
.rader_chart_container {
  position: relative;
}

#select_container {
  width: 300px;
  margin-top: 2px;
  margin-left: 30px;
  border-radius: 6px;
  padding-right: 30px;
  cursor: pointer;
}
</style>
