<template>
  <div class="container">
    <div class="top">
      <el-date-picker
        value-format="yyyy-MM-dd"
        v-model="date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.market_code"
        clearable
        placeholder="交易市场"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.goods_name"
        clearable
        placeholder="合约名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.goods_code"
        clearable
        placeholder="合约代码"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        size="small"
        type="danger"
        class="handleSearch"
        icon="el-icon-delete"
        @click="empty()"
      >清空</el-button>
      <!-- <el-button type="info" size="mini" icon="el-icon-tickets" @click="derive()">导出</el-button> -->
    </div>
    <el-table
      :data="tableData"
      border
      style="100%"
      :row-class-name="tableRowClassName"
      empty-text="暂无数据"
    >
      <el-table-column prop="buy_date" label="交易时间" align="center"></el-table-column>
      <el-table-column prop="market_code" label="交易所" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="合约名称" align="center"></el-table-column>
      <el-table-column prop="goods_code" label="合约代码" align="center"></el-table-column>
      <el-table-column prop="all_profit_buy_count" label="买涨数量" align="center"></el-table-column>
      <el-table-column prop="all_loss_buy_count" label="买跌数量" align="center"></el-table-column>
      <el-table-column prop="all_service_fee" label="手续费" align="center"></el-table-column>
      <el-table-column prop="all_end_profit_loss_amount" label="平仓盈亏" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/pagination";
import { getbuyedListDetail, sell } from "@/api/riskMonitoring/makeBargain";
export default {
  components: {
    pagination: Pagination
  },
  data() {
    return {
      //页面数据
      tableData: [],
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      search: {
        start_time: "",
        end_time: "",
        market_code: "",
        goods_name: "",
        goods_code: ""
      },
      date: [new Date(), new Date()]
    };
  },

  created() {
    this.search.start_time = parseTime(new Date());
    this.search.end_time = parseTime(new Date());
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        start_time: this.search.start_time,
        end_time: this.search.end_time,
        market_code: this.search.market_code,
        goods_name: this.search.goods_name,
        goods_code: this.search.goods_code
      };
      sell(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //导出
    derive() {
      if (this.date) {
        this.search.start_time = parseTime(this.date[0]);
        this.search.end_time = parseTime(this.date[1]);
      }
      this.$confirm("是否导出?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let link = document.createElement("a");
          link.href = `${
            this.$axios.defaults.baseURL
          }api/risk/exportBuyedListDetail?token=${getToken()}&trader_acount=${
            this.search.trader_acount
          }&start_time=${this.search.start_time}&end_time=${
            this.search.end_time
          }&real_name=${this.search.real_name}&sell_type=${
            this.search.sell_type
          }&sell_people=${this.search.sell_people}`;
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
          });
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.trader_account == "总计：") {
        return "success-row";
      }
      // return "";
    },

    //清空
    empty() {
      this.date = null;
      this.search = {
        trader_acount: "",
        start_time: "",
        end_time: "",
        real_name: "",
        sell_type: "",
        sell_people: ""
      };
    },
    // 搜索
    handleSearch() {
      if (this.date) {
        this.search.start_time = parseTime(this.date[0]);
        this.search.end_time = parseTime(this.date[1]);
      }
       this.pageData.page = 1;
       this.pageData.total = null;
      this.getData();
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.getData();
    },
    //选取页数
    handleSizeChange(page) {
      this.pageData.page = page;
      this.getData();
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  margin-bottom: 5px;
}
.btnList {
  height: 40px;
  position: relative;
}
.add {
  position: absolute;
  right: 0;
  top: 0;
}
.pagination {
  text-align: right;
  padding: 10px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>