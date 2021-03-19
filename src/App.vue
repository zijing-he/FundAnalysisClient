<template>
  <a-row>
    <a-col :span="5">
      <ControlPanelLayout
        v-on:updateFundWeight="handleUpdateFundWeight"
        :weights="incomingWeight"
      />
      <a-row>
        <MarketAnalysisLayout
          v-on:updateTimeBoundary="handleUpdateTimeBoundary"
          v-on:updateSector="handleUpdateSector"
        />
      </a-row>
      <a-row id="update_button_container">
        <a-button type="primary" @click="handleUpdateClick" id="update_button">
          <text>UPDATE</text>
        </a-button>
      </a-row>
    </a-col>

    <a-col :span="3">
      <a-row class="fund_list">
        <svg class="icon fund_list_icon" aria-hidden="true">
          <use xlink:href="#iconfund"></use>
        </svg>
        <text>Fund List</text>
      </a-row>
      <a-row>
        <FundRankingLayout
          :rankFundsID="rankFundsID"
          :rankFundsData="rankFundsData"
          :start_date="startDate"
          :end_date="endDate"
          :isRequestRanking="isRequestRanking"
          ref="fundRankingLayout"
          @showFundIDChange="handleFundProfileIDChange"
          @lineStartYPosChange="handleLineStartYPosChange"
        />
      </a-row>
    </a-col>
    <a-col :span="16">
      <a-row id="fund_list_extent"></a-row>
      <a-row class="funds_title" style="margin-top: 0px">
        <svg class="icon menuIcon" aria-hidden="true">
          <use xlink:href="#iconxitongcaidan"></use>
        </svg>
        <text>Fund Manager</text>
      </a-row>
      <a-row>
        <OverViewLayout
          :fundsData="fundsData"
          :totalWidth="totalWidth"
          :scrollLeft="scrollLeft"
        />
      </a-row>
      <a-row class="funds_title">
        <svg class="icon menuIcon" aria-hidden="true">
          <use xlink:href="#iconxitongcaidan"></use>
        </svg>
        <text>Funds Comparison</text>
        <div id="comparison_buttons">
          <select
            style="
              width: 180px;
              margin-top: 2px;
              border-radius: 6px;
              cursor: pointer;
            "
            v-model="selectIndex"
          >
            <option value="-1" disabled>History Comparison</option>
            <option
              :value="index"
              :key="index"
              v-for="(item, index) in historyFundsLikeScore"
            >
              {{ index + 1 }}
            </option>
          </select>
          <a-button type="primary" class="button" @click="handleSaveComparison">
            <text>Save Comparison</text>
          </a-button>
          <a-button type="primary" class="button" @click="handleUpdateWeight">
            <text>Update Weight</text>
          </a-button>
        </div>
      </a-row>
      <a-row>
        <FundProfileLayout
          :fundsID="showFundsID"
          :fundsLikeScore="showFundsLikeScore"
          :start_date="startDate"
          :end_date="endDate"
          :lineStartYPos="lineStartYPos"
          :isTotalChange="isTotalChange"
          :userSectors="userSectors"
          ref="fundProfileLayout"
          @updateWidth="handleUpdateWidth"
          @updateScrollLeft="handleScrollLeft"
        />
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import FundProfileLayout from "@/components/FundProfile/FundProfileLayout";
import ControlPanelLayout from "@/components/ControlPanel/layout";
import MarketAnalysisLayout from "@/components/MarketAnalysis/layout";
import OverViewLayout from "@/components/Overview/layout";
import FundRankingLayout from "@/components/FundRanking/FundRankingLayout";
import DataService from "@/utils/data-service";

export default {
  name: "App",
  components: {
    ControlPanelLayout,
    MarketAnalysisLayout,
    OverViewLayout,
    FundProfileLayout,
    FundRankingLayout,
  },
  watch: {
    selectIndex: function (val) {
      if (val === -1) return;
      this.isTotalChange = false;
      this.showFundsLikeScore = this.historyFundsLikeScore[val];
      this.showFundsID = Object.keys(this.historyFundsLikeScore[val]);
      // 更新rank里面的选中情况
      this.$refs["fundRankingLayout"].handleChangeHistoryIndex(
        this.showFundsID
      );
    },
  },
  data() {
    return {
      fundsData: null,
      fundsID: null, // 给散点图的
      startDate: "20110331", // 默认起始值
      endDate: "20191231",
      //初始化权重
      userWeight: {
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
        instl_weight: "0.0",
      },
      incomingWeight: null, //基金画像调整后传入的权重存放在这
      isRequestRanking: true,
      rankFundsID: null, // 给FundRanking
      rankFundsData: null,
      showFundsID: [], // 展示的FundProfile
      showFundsLikeScore: {},
      lineStartYPos: [], // 连线起始y坐标
      totalWidth: 900,
      scrollLeft: 0,
      historyFundsLikeScore: [],
      selectIndex: -1, // 选中的历史记录index
      isTotalChange: true, // 为真表示是改变了所有rank的数据，要重置historyFundsLikeScore；为假则表示查看历史记录或者重新选取rank，无需重置
      userSectors: null,
      managerToFund: {},
      allFundsID: [],
      allFundsData: {},
    };
  },
  computed: {},
  methods: {
    handleUpdateSector(sector) {
      this.userSectors = sector;
    },
    //点击update获得id
    handleUpdateClick() {
      this.isRequestRanking = true;
      this.showFundsID = [];
      DataService.post(
        "get_fund_ranks",
        {
          weights: this.userWeight,
          start_date: this.startDate,
          end_date: this.endDate,
          sectors: this.userSectors,
        },
        (data) => {
          console.log(data);
          this.isTotalChange = true;
          this.allFundsID = Object.keys(data.ranking);
          this.allFundsData = data.ranking;
          this.rankFundsID = this.allFundsID.slice(0, 20); // 默认展示前20个
          this.rankFundsData = {};
          this.allFundsID.forEach(d => {
            this.rankFundsData[d] = this.allFundsData[d];
          })
          this.managerToFund = data.manager2fund;
          this.isRequestRanking = false;
        }
      );
    },
    // 从雷达图获取权重
    handleUpdateFundWeight(weight) {
      this.userWeight = weight;
    },

    // getTimeBoundary() {
    //   DataService.post(
    //     "get_fund_time_border",
    //     { f_ids: this.fundsID },
    //     (data) => {
    //       this.startDate = data["start_date"].toString();
    //       this.endDate = data["end_date"].toString();
    //       this.rankFundsID = this.fundsID;
    //       //先后
    //       this.getFundManagers();
    //     }
    //   );
    // },
    getFundManagers() {
      // console.log("得到基金散点图和基金经理信息");
      //得到基金散点图和基金经理信息
      DataService.post(
        "get_manager_fund_local",
        {
          weights: this.userWeight,
          num_top: 2,
          f_ids: this.fundsID,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          console.log("得到的散点图信息：", data);
          this.fundsData = data;
        }
      );
    },
    //第二部，选取时间段
    handleUpdateTimeBoundary(start, end) {
      this.startDate = start; //start发生变化，FundProfileLayout里的start也会改变，导致getviewFunds改变
      this.endDate = end;
      // if (this.fundsID && this.userWeight) {
      //   this.getFundManagers();
      // }
    },
    handleUpdateWidth(width) {
      // console.log(width);
      this.totalWidth = width;
    },
    handleScrollLeft(value) {
      // console.log(value);
      this.scrollLeft = value;
    },
    handleFundProfileIDChange(showFundsID, lineStartYPos) {
      this.isTotalChange = false;
      this.showFundsID = showFundsID;
      this.lineStartYPos = lineStartYPos;
      this.showFundsLikeScore = {};
      this.showFundsID.forEach((d) => {
        this.showFundsLikeScore[d] = 0;
      });
      this.selectIndex = -1;
      // 刷新散点图
      this.fundsID = showFundsID;
      this.getFundManagers();
    },
    handleLineStartYPosChange(val) {
      this.lineStartYPos = val;
    },
    handleSaveComparison() {
      this.$refs["fundProfileLayout"].saveCurFundsLikeScore();
      this.historyFundsLikeScore = this.$refs[
        "fundProfileLayout"
      ].historyFundsLikeScore;
      this.selectIndex = this.historyFundsLikeScore.length - 1;
      this.$message.success("Saving successful!");
    },
    handleUpdateWeight() {
      this.$refs["fundProfileLayout"].saveCurFundsLikeScore();
      this.historyFundsLikeScore = this.$refs[
        "fundProfileLayout"
      ].historyFundsLikeScore;
      // console.log(this.historyFundsLikeScore);
      DataService.post(
        "update_weights",
        {
          weights: this.userWeight,
          pairs: this.historyFundsLikeScore,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          console.log(data);
          for (let key in data) {
            data[key] = data[key].toFixed(4);
          }
          this.incomingWeight = data;
        }
      );
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.2em;
  margin-right: 0.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
#update_button_container {
  width: 523px;
  height: 63px;
  background: #ffffff;
  box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05);
}
#update_button_container #update_button {
  width: 89%;
  margin: auto;
  border-radius: 6px;
}
#update_button_container #update_button text {
  font-size: 16px;
  font-family: "PingFangSC-Semibold";
  letter-spacing: 0;
}
.funds_title {
  position: absolute;
  display: flex;
  left: 20px;
  margin-top: 10px;
}
.funds_title text {
  font-family: PingFangSC-Semibold;
  font-size: 19px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  white-space: nowrap;
  margin-top: 5px;
  margin-left: 5px;
}
.menuIcon {
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
}
#comparison_buttons {
  display: flex;
  margin-left: 900px;
  margin-top: 5px;
}
#comparison_buttons .button {
  width: 140px;
  height: 30px;
  margin: auto;
  margin-left: 20px;
  border-radius: 6px;
}
#comparison_buttons .button text {
  font-size: 13px;
  font-family: "PingFangSC-Semibold";
  letter-spacing: 0;
  color: #ffffff;
  margin: auto;
}
.fund_list {
  background: #011f41;
  box-shadow: 1px -3px 4px 0 rgba(36, 15, 57, 0.1);
}

.fund_list text {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #d0dde7;
  letter-spacing: 0;
  margin-left: 25px;
}

.fund_list .fund_list_icon {
  position: relative;
  font-size: 19px;
  top: 3px;
  left: 22px;
}
#fund_list_extent {
  height: 37px;
  width: 1706.66px;
  background: #011f41;
  box-shadow: 1px -3px 4px 0 rgba(36, 15, 57, 0.1);
}
</style>
