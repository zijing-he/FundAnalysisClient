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
        :fundLikeScore="fundsLikeScore[item]"
        :key="item"
        @handleScroll="handleScroll"
        @handleSelect="handleSelect"
        @updateWidth="updateWidth"
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
    start_date: function(newVal, oldVal) {
      console.log("In FundProfileLayout: ", newVal);
      // 保存原分数
      if (oldVal !== null) {
        for (let i = 0; i < this.fundsID.length; i++) {
          this.fundsLikeScore[this.fundsID[i]] = this.$refs[
            this.fundsID[i]
          ].thisFundLikeScore;
        }
      }
      //限制第一次是因为id获取慢于起止点，会报错
      if (!this.isFirst) {
        this.isRequesting = true;
        this.getViewFunds();
      }
    },
    fundsID: function(newVal, oldVal) {
      console.log(`new fundsID: ${newVal}`);
      // 保存原分数
      if (oldVal !== null) {
        for (let i = 0; i < oldVal.length; i++) {
          this.fundsLikeScore[oldVal[i]] = this.$refs[
            oldVal[i]
          ].thisFundLikeScore;
        }
        this.historyFundsLikeScore.push(this.fundsLikeScore);
      }
      console.log(this.historyFundsLikeScore);
      if (this.isFirst) {
        this.isFirst = false;
      }
      this.isRequesting = true;
      this.getViewFunds();
      if (newVal.length <= 3) {
        this.eachHeight = this.totalHeight / 3;
      } else {
        this.eachHeight = this.totalHeight / newVal.length;
      }
      // 重置基金喜好分数
      this.fundsLikeScore = {};
      for (let i = 0; i < newVal.length; i++)
        this.fundsLikeScore[newVal[i]] = 0;
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
      fundsLikeScore: {},
      historyFundsLikeScore: [],
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
      this.$emit("updateScrollLeft", value);
      for (let i = 0; i < this.fundsID.length; i++)
        this.$refs[this.fundsID[i]].handleScroll(value);
    },
    handleSelect(value) {
      for (let i = 0; i < this.fundsID.length; i++)
        this.$refs[this.fundsID[i]].handleSelect(value);
    },
    updateWidth(value) {
      this.$emit("updateWidth", value);
    },
    getHistoryFundsLikeScore() {
      // 点了提交，主动获取每个基金此时的score
      for (let i = 0; i < this.fundsID.length; i++) {
        this.fundsLikeScore[this.fundsID[i]] = this.$refs[
          this.fundsID[i]
        ].thisFundLikeScore;
      }
      this.historyFundsLikeScore.push(this.fundsLikeScore);
      return this.historyFundsLikeScore;
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  width: 100%;
  border: 1px solid black;
}
</style>
