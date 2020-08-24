<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改资金':'创建资金'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @close="hideDialog"
      @open="getData"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="绑定操盘账号：" prop="user">
          <el-select
            v-model="formData.user"
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请选择账户"
            :remote-method="remoteMethod"
            :loading="outer.loading"
            @change="eslectCode(formData.user)"
          >
             <el-option
              v-for="item in outer.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="账户：" prop="account">
          <el-input v-model="formData.account" placeholder="请输入操盘账号" />
        </el-form-item>-->
        <el-form-item label="金额：" prop="amount">
          <el-input v-model="formData.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="流水号：" prop="serial_number">
          <el-input v-model="formData.serial_number" placeholder="请输入流水号" />
        </el-form-item>
        <!-- <el-form-item label="最小跳动值：" prop="code">
          <el-input v-model="formData.code" placeholder="请输市场编码" />
        </el-form-item>-->

        <el-form-item label="类型：" prop="type">
          <el-select
            v-model="formData.typeMsg"
            @change="typeVal(formData.typeMsg)"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in getGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerList } from "@/api/client/clientList";
import {
  addCapital,
  getCapitalInfo,
  editCapital
} from "@/api/client/fundsManagement";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        user: [{ required: true, message: "输入账号名称", trigger: "blur" }],
        amount: [{ required: true, message: "输入金额", trigger: "blur" }],
        serial_number: [
          { required: true, message: "输入流水号", trigger: "blur" }
        ],
        type: [{ required: true, message: "选择手续费", trigger: "change" }]
      },
      getGroup: [
        {
          label: "入金",
          value: "1"
        },
        {
          label: "出金",
          value: "2"
        },
        {
          label: "冻结",
          value: "3"
        },
        {
          label: "解冻",
          value: "4"
        }
      ],

      outer: {
        options: [],
        value: "",
        list: [],
        loading: false,
        id: ""
      },
      formData: {
        id: "",
        user: "",
        user_id: "",
        amount: "",
        serial_number: "",
        type: "",
        typeMsg: "",
        remark: ""
      }
    };
  },
  methods: {
    getData() {
      let data = {
        page: 1,
        limit: 50
      };
      getCustomerList(data).then(res => {
        this.outer.options = res.data.data.map(item => {
          return { value: `${item.trader_acount}`, label: `${item.trader_acount}` };
        });
      });
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.id
        };
        getCapitalInfo(data).then(res => {
          if (res.code == 0) {
            switch (res.data.type) {
              case 1:
                res.data.typeMsg = "入金";
                break;
              case 2:
                res.data.typeMsg = "出金";
                break;
              case 3:
                res.data.typeMsg = "冻结";
                break;
              case 4:
                res.data.typeMsg = "解冻";
                break;
            }
            this.formData = {
              id: res.data.id,
              user: res.data.trader_acount,
              userId: res.data.user_id,
              amount: res.data.amount,
              serial_number: res.data.serial_number,
              type: parseInt(res.data.type),
              typeMsg: res.data.typeMsg,
              remark: res.data.remarks
            };
            console.log(this.formData);
          }
          
        });
      }
    },
    // 获取用户列表
    getCommodityList(query) {
      let data = {
        trader_acount: query
      };
      this.outer.loading = true;
      getCustomerList(data).then(res => {
        this.outer.loading = false;

        this.outer.list = res.data.data.map(item => {
          return { value: `${item.trader_acount}`, label: `${item.trader_acount}` };
        });
        this.outer.options = this.outer.list.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      });
    },
    // 搜索用户数据
    remoteMethod(query) {
      if (query !== "") {
        console.log(query);
        this.getCommodityList(query);
      } else {
        this.outer.options = [];
      }
    },
    eslectCode(val) {
      console.log(val,33333);
      this.formData.userId = val;
    },
    //关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.$refs["formData"].resetFields();
      this.formData = {
        id: "",
        user_id: "",
        amount: "",
        serial_number: "",
        type: "",
        typeMsg: "",
        remark: ""
      };
    },
    // 选择状态
    typeVal(val) {
      this.formData.type = val;
    },
    //选择币种
    currencyVal(val, sum) {
      switch (sum) {
        case 1:
          this.formData.getGroupVal = val;
          break;
        case 2:
          this.formData.getServerVal = val;
          break;
        case 3:
          this.formData.getPositionVal = val;
          break;
        case 4:
          this.formData.getTimingVal = val;
          break;
      }
    },
    //提交
    confirm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let data = {
            trader_acount: this.formData.user,
            amount: this.formData.amount,
            serial_number: this.formData.serial_number,
            type: this.formData.type,
            remarks: this.formData.remark
          };
        
          if (this.dialog.dialogType === "edit") {
            data.id = this.formData.id;
            editCapital(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.hideDialog();
                this.$emit("upData");
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            addCapital(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.hideDialog();
                this.$emit("upData");
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  }
};
</script>