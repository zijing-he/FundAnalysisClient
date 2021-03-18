<template>
  <!-- <div class="search_container">
    <div class="search_fund">
    <a-input-search
      v-model:value="fundValue"
      placeholder="查询基金"
      enter-button
      @search="onSearchFund"
    />
    </div>
     <div class="search_manager">
    <a-input-search
      v-model:value="managerValue"
      placeholder="查询基金经理"
      enter-button
      @search="onSearchManager"
    />
    </div>
  </div> -->

  <div>
    <a-row type="flex" align="middle" class="first_row">
      <!-- <div class="button_container"> -->
      <a-col :span="2">
        <!-- <div class="button"> -->
        <a-button
          type="primary"
          :disabled="!hasSelected"
          :loading="loading"
          @click="handleClick"
        >
          确定
        </a-button>
        <!-- </div> -->
      </a-col>
      <a-col :span="2">
        <!-- <div class="text"> -->
        <template v-if="hasSelected">
          {{ `选择了 ${selectedRowKeys.length} 支基金` }}
        </template>
        <!-- </div> -->
      </a-col>
      <!-- </div> -->
    </a-row>
    <a-row class="second_row">
      <!-- <div> -->

      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="list"
        :scroll="{ x: 1800 }"
      >
      </a-table>
      <!-- </div> -->
    </a-row>
  </div>
</template>
<script>
import { message } from "ant-design-vue";
export default {
  name: "SortedList",
  props: {
    list: Array,
  },
  data() {
    return {
      columns: [
        {
          title: "排序",
          width: 60,
          dataIndex: "key", //列数据在数据项中对应的 key
          key: "key", //Vue 需要的 key, dataIndex唯一可以忽略
          fixed: "left", //列是否固定，可选 true(等效于 left) 'left' 'right'
        },
        {
          title: "基金代码",
          width: 90,
          dataIndex: "id",
          fixed: "left",
        },
        {
          title: "基金规模",
          width: 90,
          dataIndex: "size",
        },
        {
          title: "机构占比",
          width: 90,
          dataIndex: "instl_weight",
        },
        {
          title: "阿尔法系数",
          width: 110,
          dataIndex: "alpha",
        },
        {
          title: "贝塔系数",
          width: 90,
          dataIndex: "beta",
        },
        {
          title: "夏普率",
          width: 80,
          dataIndex: "sharp_ratio",
        },
        {
          title: "最大回撤率",
          width: 110,
          dataIndex: "max_drop_down",
        },
        {
          title: "信息比率",
          width: 90,
          dataIndex: "information_ratio",
        },
        {
          title: "标准差",
          width: 80,
          dataIndex: "risk",
        },
        {
          title: "1个季度的收益率",
          width: 140,
          dataIndex: "one_quarter_return",
        },
        {
          title: "1年的收益率",
          width: 110,
          dataIndex: "one_year_return",
        },
        {
          title: "3年的收益率",
          width: 110,
          dataIndex: "three_year_return",
        },
        {
          title: "1个季度的超额收益率",
          width: 170,
          dataIndex: "one_quarter_car",
        },
        {
          title: "1年的超额收益率",
          width: 140,
          dataIndex: "one_year_car",
        },
        {
          title: "3年的超额收益率",
          dataIndex: "three_year_car",
        },
      ],
      selectedRowKeys: [],
      loading: false,
      fundId: [],
      fundValue: "",
      managerValue: "",
    };
  },
  components: {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  emits: ["updateFundId"],
  methods: {
    onSearchFund(fundValue) {
      console.log("查找的基金ID：", fundValue, this.fundValue);
    },
    onSearchManager(managerValue) {
      console.log("查找的基金经理ID", managerValue, this.managerValue);
    },
    onSelectChange(selectedRowKeys) {
      //点击之后的反应
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      if (selectedRowKeys.length <= 5) {
        this.selectedRowKeys = selectedRowKeys;
      } else {
        // window.alert("基金比较不宜多于5个~");
        message.error("基金比较不宜多于5个~", 2);
      }
    },
    handleClick() {
      this.loading = true;
      // console.log("选择的基金序号", this.selectedRowKeys);

      // let fundId = [];
      //选择的基金id
      this.list.forEach((d, i) => {
        if (this.selectedRowKeys.indexOf(i + 1) !== -1) {
          this.fundId.push(d.id);
        }
      });

      //点击后——>向上传递勾选的ID
      this.$emit("updateFundId", this.fundId);

      //得到基金散点图和基金经理信息
      // DataService.post(
      //   "get_manager_fund_local",
      //   { weights: this.weights, num_top: 10, f_ids: fundId },
      //   (data) => {
      //     this.$emit("updateChart", data);
      //   }
      // );
      setTimeout(() => {
        this.loading = false;
        // this.selectedRowKeys = []; //清空
        this.fundId = [];
      }, 1000);
    },
  },
  mounted() {},
};
</script>
<style scoped>
.search_container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  /* margin-top:10px; */
}
.search_fund {
  width: 50%;
}
.search_manager {
  width: 50%;
}
.button_container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.text {
  margin-left: 10px;
  font-size: 15px;
}
.ant-table td {
  font-size: 12px;
}
.ant-table th {
  font-size: 12px;
}
.first_row {
  /* style="width:2533px;margin-top:10px;border:1px solid black;" */
  width: 2533px;
  margin-top: 10px;
  border: 1px solid black;
}
.second_row{
   border-left: 1px solid black;
   border-right: 1px solid black;
   border-bottom: 1px solid black;
}
</style>