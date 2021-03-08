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
    fundsID: function() {
      this.isRequesting = true;
      this.getViewFunds();
    },
  },
  data() {
    return {
      componentName: "FundProfile",
      fundData: undefined,
      isRequesting: true,
      totalHeight: 905,
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
          console.log(data);
          this.fundData = data;
          console.log(
            this.start_date,
            this.end_date,
            this.fundsID,
            this.fundData
          );
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
