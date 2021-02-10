<template>
  <div class="container">
    <FundProfile />
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
</style>