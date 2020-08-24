<template>
  <div class="container">
    <div class="btnList">
      <el-button
        size="small"
        type="success"
        icon="el-icon-circle-check"
        class="handleSearch"
        @click="allow()"
      >允许交易</el-button>
      <el-button
        size="small"
        type="warning"
        icon="el-icon-circle-close"
        class="handleSearch"
        @click="forbid()"
      >禁止交易</el-button>
      <el-button
        size="small"
        type="info"
        icon="el-icon-coin"
        class="handleSearch"
        @click="closeOut()"
      >只可平仓</el-button>
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加品种</el-button>
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
      <el-table-column prop="goods_code" label="品种编码" align="center"></el-table-column>
      <el-table-column prop="name" label="品种名称" align="center"></el-table-column>
      <el-table-column prop="market_code" label="市场编码" align="center"></el-table-column>
      <el-table-column prop="market_name" label="市场名称" align="center"></el-table-column>
      <el-table-column prop="statusMsg" label="状态" align="center"></el-table-column>
      <el-table-column prop="create_time" sortable label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            @click="guarantee(scope)"
          >设置保证金</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addVarietyDialog :dialog="dialog" @upData="getData"></addVarietyDialog>
    <!-- 设置保证金 -->
    <guaranteeDialog :guaranteeDialog="guaranteeDialog" @upData="getData"></guaranteeDialog>
  </div>
</template>
<script>
import GuaranteeDialog from "@/components/deal/guaranteeDialog";
import AddVarietyDialog from "@/components/deal/addVarietyDialog";
import Pagination from "@/components/pagination";
import { parseTime } from "@/utils/index";
import { getGoodsList, changeStatus, delGoods } from "@/api/deal/variety";
export default {
  components: {
    pagination: Pagination,
    addVarietyDialog: AddVarietyDialog,
    guaranteeDialog: GuaranteeDialog
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
        dialogType: "",
        id: ""
      },
      guaranteeDialog: {
        centerDialogVisible: false,
        id: "",
        number: 0
      },
      formData: {},
      search: {
        name: "",
        code: "",
        market_code: "",
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
        goods_code: this.search.code,
        market_code: this.search.market_code,
        sort: this.search.sort,
        order_field: this.search.order_field
      };

      getGoodsList(data)
        .then(res => {
          if (res.code == 0) {
            res.data.data.forEach(res => {
              res.create_time = parseTime(res.create_time);
              switch (res.status) {
                case 0:
                  res.statusMsg = "禁止交易";
                  break;
                case 1:
                  res.statusMsg = "允许交易";
                  break;
                case 2:
                  res.statusMsg = "只可平仓";
                  break;
              }
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
    //添加品种
    addPermission() {
      this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
    },
    //修改品种
    handleEdit(scope) {
      console.log(scope);
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.dialog.id = scope.row.id;
    },
    //允许交易
    allow() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择品种"
        });
        return;
      } else {
        let data = {
          id: this.multipleSelection,
          status: 1
        };
        changeStatus(data).then(res => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      }
    },
    //禁止交易
    forbid() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择品种"
        });
        return;
      } else {
        let data = {
          id: this.multipleSelection,
          status: 0
        };
        changeStatus(data).then(res => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      }
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
          this.search.order_field = "";
          break;
      }
      this.getData();
    },
    //平仓
    closeOut() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择品种"
        });
        return;
      } else {
        let data = {
          id: this.multipleSelection,
          status: 2
        };
        changeStatus(data).then(res => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      }
    },
    // 删除
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
          delGoods(data).then(res => {
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
    guarantee(scope) {
      this.guaranteeDialog.centerDialogVisible = true;
      this.guaranteeDialog.id = scope.row.id;
      this.guaranteeDialog.number = scope.row.stop_profile_loss_base_amount;
    },
    //多选
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
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
    //选取
    handleSelectionChange(val) {
      this.multipleSelection = [];
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