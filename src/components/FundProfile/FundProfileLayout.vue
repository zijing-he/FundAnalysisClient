<template>
  <div class="container">
    <h4>基金详细对比</h4>
    <FundProfile />
    <!-- <FundProfile /> -->
  </div>
</template>
<script>
import FundProfile from "@/components/FundProfile/FundProfile";
export default {
  name: "FundProfileLayout",
  data() {
    return {};
  },
  components: {
    FundProfile,
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
}
</style>