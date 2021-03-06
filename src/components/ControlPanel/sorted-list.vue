<template>
  <div>
    <div>
      <a-button
        type="primary"
        :disabled="!hasSelected"
        :loading="loading"
        @click="handleClick"
        style="margin-top: 10px"
      >
        确定
      </a-button>
      <span style="margin-left: 15px">
        <template v-if="hasSelected">
          {{ `选择了 ${selectedRowKeys.length} 支基金` }}
        </template>
      </span>
    </div>
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="list"
      :scroll="{ x: 1400 }"
    >
    </a-table>
  </div>
</template>
<script>


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
          width: 80,
          dataIndex: "id",
          fixed: "left",
        },
        {
          title: "stock",
          width: 70,
          dataIndex: "stock",
        },
        {
          title: "bond",
          width: 70,
          dataIndex: "bond",
        },
        {
          title: "cash",
          width: 70,
          dataIndex: "cash",
        },
        {
          title: "other",
          width: 70,
          dataIndex: "other",
        },
        {
          title: "size",
          width: 130,
          dataIndex: "size",
        },
        {
          title: "alpha",
          width: 70,
          dataIndex: "alpha",
        },
        {
          title: "beta",
          width: 70,
          dataIndex: "beta",
        },
        {
          title: "夏普率",
          width: 70,
          dataIndex: "sharp_ratio",
        },
        {
          title: "最大回撤率",
          width: 100,
          dataIndex: "max_drop_down",
        },
        {
          title: "信息比率",
          width: 90,
          dataIndex: "information_ratio",
        },
        {
          title: "nav_return",
          width: 90,
          dataIndex: "nav_return",
        },
        {
          title: "risk",
          width: 70,
          dataIndex: "risk",
        },
        {
          title: "instl_weight",
          width: 100,
          dataIndex: "instl_weight",
        },
        {
          title: "car",
          dataIndex: "car",
        },
      ],
      selectedRowKeys: [],
      loading: false,
    };
  },
  components: {},
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      //点击之后的反应
      //   console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleClick() {
      this.loading = true;
      // console.log("选择的基金序号", this.selectedRowKeys);

      let fundId = [];
      //选择的基金id
      this.list.forEach((d, i) => {
        if (this.selectedRowKeys.indexOf(i + 1) !== -1) {
          fundId.push(d.id);
        }
      });

      //点击后——>向上传递勾选的ID
      this.$emit("updateFundId", fundId);

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
      }, 1000);
    },
  },
  mounted() {},
};
</script>

<style >
.ant-table td {
  font-size: 12px;
}
.ant-table th {
  font-size: 12px;
}

</style>