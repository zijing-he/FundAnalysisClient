<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1300 }"
      size="middle"
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
  watch: {
    list: function () {
      console.log("大人时代变了！");
      console.log(this.list);
    },
  },
  data() {
    return {
      columns: [
        {
          title: "排序",
          width: 30, //可以定住
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
          width: 110,
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
          title: "sharp_ratio",
          width: 70,
          dataIndex: "sharp_ratio",
        },
        {
          title: "最大回撤率",
          width: 70,
          dataIndex: "max_drop_down",
        },
        {
          title: "信息比率",
          width: 70,
          dataIndex: "information_ratio",
        },
        {
          title: "nav_return",
          width: 70,
          dataIndex: "nav_return",
        },
        {
          title: "risk",
          width: 70,
          dataIndex: "risk",
        },
        {
          title: "instl_weight",
          width: 70,
          dataIndex: "instl_weight",
        },
        {
          title: "car",
          dataIndex: "car",
        },
      ],
      data: this.list,
      //   data: [
      //     {
      //       key: "1",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "2",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "3",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "4",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "5",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "6",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "7",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "8",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "9",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //     {
      //       key: "10",
      //       alpha: 0.0153,
      //       beta: 0.9412,
      //       bond: 0,
      //       car: -0.0388,
      //       cash: 0.0014,
      //       id: "510050",
      //       information_ratio: 0.0939,
      //       instl_weight: 0.7062,
      //       max_drop_down: 0.7023,
      //       nav_return: 0.0286,
      //       other: 0.0,
      //       risk: 0.0451,
      //       sharp_ratio: 0.939,
      //       size: 46191167536.83,
      //       stock: 0.9995,
      //     },
      //   ],
    };
  },
  components: {},
  methods: {},
  mounted() {
    console.log("传递进来了！");
    console.log(this.list);
  },
};
</script>

<style >
.ant-table td {
  font-size: 12px;
  padding: 0px;
}
.ant-table th {
  font-size: 12px;
}
</style>