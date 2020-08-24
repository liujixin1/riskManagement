<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.keyword"
        clearable
        placeholder="用户名"
      ></el-input>
      <el-date-picker
        value-format="yyyy-MM-dd"
        v-model="date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
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
      <el-button type="info" size="mini" icon="el-icon-tickets" @click="derive()">导出</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
    >
      <el-table-column prop="realname" label="用户名" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额" align="center"></el-table-column>
      <el-table-column prop="update_at" sortable label="操作时间" align="center"></el-table-column>
      <el-table-column prop="remark"  label="备注" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/pagination";
import { getCapitalDetail } from "@/api/client/fundsDetailList";
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
        keyword: '',
        starttime: '',
        endtime: ''
      },
      date:null
    };
  },

  created() {
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        keyword: this.search.keyword,
        starttime: this.search.starttime,
        endtime: this.search.endtime
      };
      getCapitalDetail(data)
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
        this.search.starttime = this.date[0];
        this.search.endtime = this.date[1];
      }
       console.log(this.$axios.defaults.baseURL)
      this.$confirm("是否导出?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let link = document.createElement("a");
          link.href = `${
            this.$axios.defaults.baseURL
          }api/Capital/exportCapitalDetail?keyword=${
            this.search.keyword
          }&starttime=${this.search.starttime}&endtime=${
            this.search.endtime
          }`;
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
          });
        });
    },
     //清空
    empty() {
      this.date =null;
      this.search = {
         keyword: '',
        starttime: '',
        endtime: ''
      };
    },
    // 搜索
    handleSearch() {
       if (this.date) {
        this.search.starttime = this.date[0];
        this.search.endtime = this.date[1];
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
</style>