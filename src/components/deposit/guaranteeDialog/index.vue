<template>
  <div class="container">
    <el-dialog
      title="保证金分组设置"
      :visible.sync="guaranteeDialogs.centerDialogVisible"
      width="60%"
      center
      :lock-scroll="true"
      @close="hideDialog"
      @open="getData"
    >
      <div class="top">
        <el-input
          style="width:150px;margin-bottom:5px"
          v-model="seach.bazaarName"
          clearable
          placeholder="请输入市场名称"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          class="handleSearch"
          @click="bazaarSearch()"
        >查询</el-button>
      </div>
      <el-tabs v-model="editableTabsValue" @tab-click="clickTab">
        <el-tab-pane
          :key="item.name"
          v-for="item in editableTabs"
          :label="item.title"
          :name="item.name"
        >
          <div class="top">
            <el-input
              style="width:200px;margin-bottom:5px"
              v-model="seach.name"
              clearable
              placeholder="请输入品种名称"
            ></el-input>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              class="handleSearch"
              @click="handleSearch()"
            >查询</el-button>
            <el-button
              class="add"
              size="small"
              type="primary"
              icon="el-icon-circle-plus"
              @click="addPermission"
            >检测</el-button>
          </div>
          <el-table border :data="gridData">
            <el-table-column prop="name" label="交易品种" align="center"></el-table-column>
            <el-table-column label="保证金" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.cash_deposit_name"
                  placeholder="请选择保证金"
                  @change="handleChange(scope)"
                >
                  <el-option
                    v-for="item in options[scope.$index]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- <el-input-number
                  :controls="false"
                  size="small"
                  v-model="scope.row.service_fee"
                  @change="handleChange(scope)"
                  label="描述文字"
                ></el-input-number>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { getMarketList } from "@/api/deal/bazaar";
import {
  getGoodsGroupServiceFee,
  setGoodsGroupServiceFee,
  check,
  getGoodsCashDepositList
} from "@/api/deposit/depositList";
export default {
  props: {
    guaranteeDialogs: Object
  },
  data() {
    return {
      editableTabsValue: "2",
      editableTabs: [],
      gridData: [],
      seach: {
        name: "",
        bazaarName: ""
      },
      cashDepositList: null,
      options: []
    };
  },
  methods: {
    //获取数据
    getData() {
      this.editableTabs = [];
      let data = {
        limit: 100,
        page: 1,
        name: this.seach.bazaarName
      };
      getMarketList(data).then(res => {
        if (res.code == 0) {
          this.editableTabsValue = res.data.data[0].id + "";
          this.getMsgList(this.editableTabsValue);
          res.data.data.forEach(res => {
            this.editableTabs.push({
              title: res.name + "",
              name: res.id + ""
            });
          });
        }
      });
    },
    getDatas(id, index) {
      let data = {
        goods_id: id
      };
      getGoodsCashDepositList(data).then(res => {
        if (res.code == 0) {
          let arr = [];
          res.data.forEach((res, indexs) => {
            arr.push({
              value: res.id,
              label: res.cash_deposit_name
            });
            this.$set(this.options,index,arr)
          });
        }
      });
    },
    //设置手续费
    handleChange(scope) {
      // console.log(scope);
      // return
      let data = {
        goods_id: scope.row.id,
        group_id: this.guaranteeDialogs.id,
        cash_deposit_id: scope.row.cash_deposit_name
      };
      setGoodsGroupServiceFee(data).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.getMsgList(this.editableTabsValue);
        }
      });
    },
    //点击tab
    clickTab(targetName) {
      console.log(targetName);
      this.options = [];

      this.editableTabsValue = targetName.name;
      this.getMsgList(this.editableTabsValue);
    },
    //市场搜索
    bazaarSearch() {
      this.getData();
    },
    //保证金详情列表
    getMsgList(id) {
      let data = {
        market_id: id,
        group_id: this.guaranteeDialogs.id,
        name: this.seach.name
      };
      getGoodsGroupServiceFee(data).then(res => {
        this.gridData = res.data;

        console.log(this.gridData, 11111111111);
        if (this.gridData.length > 0) {
          res.data.forEach((result, index) => {
            console.log(result, index, 9999999);
            this.getDatas(result.id, index);
          });
        }
      });
    },
    //品种查询
    handleSearch() {
      this.getMsgList(this.editableTabsValue);
    },
    //检测
    addPermission() {
      let data = {
        group_id: this.guaranteeDialogs.id
      };
      check(data).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message
          });
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    // 关闭
    hideDialog() {
      this.guaranteeDialogs.centerDialogVisible = false;
      this.seach = {
        name: "",
        bazaarName: ""
      };
    },
    //提交
    confirm() {},
    //取消
    cancel() {
      this.hideDialog();
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
  display: block;
  position: absolute;
  top: 6px;
  right: 0;
}
</style>