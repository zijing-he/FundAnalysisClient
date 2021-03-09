<template>
  <div class="container">
    <a-spin
      v-if="isRequesting"
      size="large"
      tip="Loading..."
      style="margin-top: 105px; margin-bottom: 105px"
    />
    <div v-if="!isRequesting">
      <component
        :is="componentName"
        :ref="item"
        :fundData="fundData"
        :fundIds="fundsID"
        :fundId="item"
        :startDate="start_date"
        :endDate="end_date"
        :boxHeight="eachHeight"
        :key="item"
        @handleScroll="handleScroll"
        @handleSelect="handleSelect"
        v-for="item in fundsID"
      >
      </component>
    </div>
  </div>
</template>
<script>
import FundProfile from "@/components/FundProfile/FundProfile";
import DataService from "@/utils/data-service";

export default {
  name: "FundProfileLayout",
  props: {
    fundsID: Array,
    start_date: String,
    end_date: String,
  },
  watch: {
    start_date: function (val) {
      //限制第一次是因为id获取慢于起止点，会报错
      if (!this.isFirst) {
        this.getViewFunds();
      }
    },
    fundsID: function (val) {
      if (this.isFirst) {
        this.isFirst = false;
      }
      this.isRequesting = true;
      this.getViewFunds();
      if (val.length <= 3) {
        this.eachHeight = this.totalHeight / 3;
      } else {
        this.eachHeight = this.totalHeight / val.length;
      }
    },
  },
  data() {
    return {
      componentName: "FundProfile",
      fundData: undefined,
      isRequesting: true,
      totalHeight: 905,
      eachHeight: 270,
      isFirst: true,
    };
  },
  components: {
    FundProfile,
  },
  methods: {
    getViewFunds() {
      DataService.post(
        "get_view_funds",
        {
          f_ids: this.fundsID,
          start_date: this.start_date,
          end_date: this.end_date,
        },
        (data) => {
          console.log("get_view_funds", data);
          this.fundData = data;
          this.isRequesting = false;
        }
      );
    },
    handleScroll(value) {
      for (let i = 0; i < this.fundsID.length; i++)
        this.$refs[this.fundsID[i]].handleScroll(value);
    },
    handleSelect(value) {
      for (let i = 0; i < this.fundsID.length; i++)
        this.$refs[this.fundsID[i]].handleSelect(value);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  width: 100%;
  border: 1px solid black;
}
</style>
