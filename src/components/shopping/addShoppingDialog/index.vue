<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改购货单':'创建购货单'"
      :visible.sync="dialog.centerDialogVisible"
      width="800px"
      center
      :lock-scroll="true"
    >
      <div class="top">
        <el-select
          size="small"
          v-model="outer.value"
          :multiple="false"
          filterable
          remote
          reserve-keyword
          placeholder="请输入商品"
          :remote-method="remoteMethod"
          :loading="outer.loading"
        >
          <el-option
            v-for="item in outer.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          class="add"
          size="small"
          type="primary"
          icon="el-icon-circle-plus"
          @click="addShopping"
        >添加商品</el-button>
      </div>
      <el-table :data="formData" border style="width: 100%" empty-text="暂无数据">
        <el-table-column prop="name" label="商品" align="center"></el-table-column>
        <el-table-column prop="code" label="编号" align="center"></el-table-column>
        <el-table-column label="数量" align="center" width="180">
          <template slot-scope="scope">
            <el-input-number size="small" :controls="false" v-model="scope.row.sum1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="180">
          <template slot-scope="scope">
            <el-input-number size="small" :controls="false" v-model="scope.row.sum2"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleEdit(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="30%"
        title="选择供应商"
        center
        :lock-scroll="true"
        :visible.sync="inside.innerVisible"
        append-to-body
      >
        <div class="main">
          <el-select
            size="small"
            v-model="inside.value"
            :multiple="false"
            filterable
            remote
            center
            reserve-keyword
            placeholder="请选择供应商"
            :remote-method="insideRemoteMethod"
            :loading="inside.loading"
          >
            <el-option
              v-for="item in inside.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="insideCancel">取 消</el-button>
          <el-button type="primary" @click="insideConfirm()">确 定</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { supplierList } from "@/api/supplier/supplierList";
import { commodityList } from "@/api/commodity/commodityList";
import { addShopping } from "@/api/shopping/shoppingList";

export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      formData: [],
      rules: {
        num1: [{ required: true, message: "填写角色名称", trigger: "blur" }],
        num2: [{ required: true, message: "填写描述", trigger: "blur" }]
      },
      commodityList: [],

      outer: {
        options: [],
        value: "",
        list: [],
        loading: false
      },
      inside: {
        innerVisible: false,
        options: [],
        value: "",
        list: [],
        loading: false
      }
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    //获取数据
    getSupplierList(query) {
      let data = {
        search: query,
        page: 1,
        limit: 100
      };
      this.inside.loading = true;
      supplierList(data).then(res => {
        this.inside.list = res.data.data.map(item => {
          return { value: `${item.code}`, label: `${item.name}` };
        });
        this.inside.options = this.inside.list.filter(item => {
          this.inside.loading = false;
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      });
    },
    //获取商品列表
    getCommodityList(query) {
      let data = {
        search: query,
        page: 1,
        limit: 100
      };
      this.outer.loading = true;
      commodityList(data).then(res => {
        this.outer.list = res.data.data.map(item => {
          return { value: `${item.code}`, label: `${item.name}` };
        });
        this.outer.loading = false;
        this.outer.options = this.outer.list.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
        this.commodityList = res.data.data;
      });
    },
    // 删除
    handleEdit(scope) {
      console.log(scope);
      let code = scope.row.code;
      this.formData.forEach((res, index) => {
        if (res.code == code) {
          this.formData.splice(index, 1);
        }
      });
      console.log(this.formData);
    },
    //显示嵌套层
    confirm() {
      console.log(this.formData);
      if (this.formData.length > 0) {
        this.inside.innerVisible = true;
      } else {
        this.$message({
          message: "请添加商品",
          type: "info"
        });
      }
    },
    // 提交
    insideConfirm() {
      if (this.inside.value == "") {
        this.$message({
          message: "请选择供应商",
          type: "info"
        });
      } else {
        let formDataList = [];

        this.formData.forEach(res => {
          formDataList.push({
            good_id: res.id,
            good_erp_id: res.erp_id,
            good_code: res.code,
            name: res.name,
            price: res.sum2,
            count: res.sum1,
            unit: res.unit,
            markup: res.markup
          });
        });
        let data = {
          supplier_id: this.inside.value,
          goods_data: JSON.stringify(formDataList)
        };
        console.log(data);
        addShopping(data).then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.hideDialog();
            this.$emit("upData");
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
          this.hideDialog();
          this.insideHideDialog();
        });
      }
    },
    //添加商品
    addShopping() {
      if (this.outer.value == "") {
        this.$message({
          message: "请选择商品",
          type: "info"
        });
      } else {
        let bool = this.formData.some(res => {
          return res.code == this.outer.value;
        });
        if (bool) {
          this.$message({
            message: "已添加该商品",
            type: "info"
          });
        } else {
          let commodity = this.commodityList.filter(res => {
            return res.code == this.outer.value;
          });
          commodity[0].sum1 = 1;
          commodity[0].sum2 = 1;
          this.formData.push(commodity[0]);
        }
      }
    },
    //搜索商品数据
    remoteMethod(query) {
      if (query !== "") {
        console.log(query);
        this.getCommodityList(query);
      } else {
        this.outer.options = [];
      }
    },
    // 嵌套搜索供应商数据
    insideRemoteMethod(query) {
      if (query !== "") {
        this.getSupplierList(query)
      } else {
        this.inside.options = [];
      }
    },
    //取消
    cancel() {
      this.hideDialog();
    },
    //取消方法
    hideDialog() {
      this.dialog.centerDialogVisible = false;
    },
    // 嵌套取消
    insideCancel() {
      this.insideHideDialog();
    },
    // 嵌套取消方法
    insideHideDialog() {
      this.inside.innerVisible = false;
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  height: 40px;
}
.main {
  display: flex;
  justify-content: center;
}
</style>