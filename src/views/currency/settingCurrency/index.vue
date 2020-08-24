<template>
  <div class="container">
    <div class="top">
      <!-- <el-input
        style="width:200px;margin-bottom:5px"
        v-model="searchName"
        clearable
        placeholder="请输入名称"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button> -->
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加币种</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <el-table-column prop="name" label="币种名称" align="center"></el-table-column>
      <el-table-column prop="exchange_rate" label="汇率" align="center"></el-table-column>
      <el-table-column prop="create_time" label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addCurrencyDialog
      :dialog="dialog"
      :formData="formData"
      @upData="getData"
      @upFormData="upFormData"
    ></addCurrencyDialog>
  </div>
</template>
<script>
import AddCurrencyDialog from "@/components/addCurrencyDialog";
import Pagination from "@/components/pagination";
import { getCurrencyList,delCurrency } from "@/api/currency/settingCurrency";
export default {
  components: {
    pagination: Pagination,
    addCurrencyDialog: AddCurrencyDialog
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
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        dialogType: ""
      },
      formData: {
        id: "",
        name: "",
        grouping: ""
      },
      searchName: ""
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
        page: this.pageData.page
      };

      getCurrencyList(data)
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
    //添加币种
    addPermission() {
      this.formData.name = '';
      this.formData.describe = '';
      this.formData.id = '';
       this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
    },
    //修改币种
    handleEdit(scope) {
      console.log(scope);
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.formData = {
        id: scope.row.id,
        name: scope.row.name,
        describe: scope.row.exchange_rate,
      
      };
    },
    //删除
    handleDelete(scope) {
      let data = {
        id: scope.row.id
      };
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCurrency(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //dialog触发该函数。关闭dialog,在没对表单重置之前先清空表单。
    upFormData() {
      this.formData = {
        id: "",
        name: "",
        grouping: "",
        groupingCode: "",
        getController: "",
        getActions: ""
      };
    },
    // 搜索
    handleSearch() {},
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
    },
    //选取
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  height: 45px;
}

.add {
  position: absolute;
  right: 0;
  top: 4px;
}
.pagination {
  text-align: right;
  padding: 10px;
}
</style>