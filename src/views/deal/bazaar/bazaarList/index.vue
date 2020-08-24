<template>
  <div class="container">
    <div class="btnList">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-check"
        class="handleSearch"
        @click="allow(1)"
      >允许交易</el-button>
      <el-button
        size="small"
        type="warning"
        icon="el-icon-circle-close"
        class="handleSearch"
        @click="allow(0)"
      >禁止交易</el-button>
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加市场</el-button>
    </div>
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.name"
        clearable
        placeholder="请输入名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.code"
        clearable
        placeholder="请输入编码"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
      @sort-change="arraySpanMethod"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="code" label="市场编码" align="center"></el-table-column>
      <el-table-column prop="name" label="市场名称" align="center"></el-table-column>
      <el-table-column prop="statusMsg" label="市场状态" align="center"></el-table-column>
      <el-table-column prop="create_time" sortable label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addBazaarDialog
      :dialog="dialog"
      :formData="formData"
      @upData="getData"
      @upFormData="upFormData"
    ></addBazaarDialog>
  </div>
</template>
<script>
import AddBazaarDialog from "@/components/deal/addBazaarDialog";
import Pagination from "@/components/pagination";
import { getMarketList, delMarket, changeDealStatus } from "@/api/deal/bazaar";
export default {
  components: {
    pagination: Pagination,
    addBazaarDialog: AddBazaarDialog
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
        code: "",
        statusMsg: "",
        status: ""
      },
      search: {
        name: "",
        code: "",
        sort: "",
        order_field: ""
      },
      multipleSelection: []
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
        name: this.search.name,
        code: this.search.code,
        sort: this.search.sort,
        order_field: this.search.order_field
      };

      getMarketList(data)
        .then(res => {
          if (res.code == 0) {
            res.data.data.forEach(res => {
              res.statusMsg = res.status == 1 ? "允许交易" : "禁止交易";
            });
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
    //排序
    arraySpanMethod(prop) {
      this.search.order_field = prop.prop;
      switch (prop.order) {
        case "ascending":
          this.search.sort = "asc";
          break;
        case "descending":
          this.search.sort = "desc";
          break;
        case null:
          this.search.sort = "";
          this.search.order_field="";
          break;
      }
      this.getData()
    },
    //添加市场
    addPermission() {
      this.formData.name = "";
      this.formData.code = "";
      this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
      this.formData.status = "";
      this.formData.statusMsg = "";
    },
    //修改市场
    handleEdit(scope) {
      console.log(scope);
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.formData = {
        id: scope.row.id,
        name: scope.row.name,
        code: scope.row.code,
        status: scope.row.status,
        statusMsg: scope.row.statusMsg
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
          delMarket(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.message
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

    //交易状态
    allow(sum) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择市场"
        });
        return;
      } else {
        let data = {
          id: this.multipleSelection,
          status: sum
        };
        changeDealStatus(data).then(res => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: res.message
            });
            this.multipleSelection = [];
          }
        });
      }
    },
    // 搜索
    handleSearch() {
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
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = []
      val.forEach(res => {
        this.multipleSelection.push(res.id);
      });
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  height: 45px;
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