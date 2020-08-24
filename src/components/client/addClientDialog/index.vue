<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改用户':'创建用户'"
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
        <el-form-item label="操盘账号：" prop="name">
          <el-input
            :disabled="dialog.dialogType==='edit'"
            v-model="formData.name"
            placeholder="请输入操盘账号"
          />
        </el-form-item>
        <!-- <el-form-item label="绑定用户：" prop="user">
          <el-input v-model="formData.user" placeholder="请输入用户" />
        </el-form-item>-->

        <el-form-item label="绑定用户：" prop="user">
          <el-select
            v-model="formData.user"
            :multiple="false"
            filterable
            remote
            reserve-keyword
            :disabled="dialog.dialogType==='edit'"
            placeholder="请选择用户"
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
        <!-- <el-form-item label="最小跳动值：" prop="code">
          <el-input v-model="formData.code" placeholder="请输市场编码" />
        </el-form-item>-->

        <el-form-item label="保证金分组：" prop="getGroupVal">
          <el-select
            v-model="formData.getGroup"
            @change="currencyVal(formData.getGroup,1)"
            placeholder="请选择保证金"
          >
            <el-option
              v-for="item in getGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手续费分组：" prop="getServerVal">
          <el-select
            v-model="formData.getServer"
            @change="currencyVal(formData.getServer,2)"
            placeholder="请选择手续费"
          >
            <el-option
              v-for="item in getServer"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限额分组：" prop="getPositionVal">
          <el-select
            v-model="formData.getPosition"
            @change="currencyVal(formData.getPosition,3)"
            placeholder="请选择限额"
          >
            <el-option
              v-for="item in getPosition"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时强平分组：" prop="getTimingVal">
          <el-select
            v-model="formData.getTiming"
            @change="currencyVal(formData.getTiming,4)"
            placeholder="请选择定时强平分"
          >
            <el-option
              v-for="item in getTiming"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="额度强平线" prop="limit">
          <el-input-number v-model="formData.limit" :controls="false" label="请输入额度强平线"></el-input-number>
        </el-form-item>
        <el-form-item label="风险度强平" prop="risk">
          <el-input-number v-model="formData.risk" :controls="false" label="请输入风险度强平"></el-input-number>
        </el-form-item>
        <el-form-item label="开关">
          <el-switch
            style="display: block;margin-top:10px"
            v-model="formData.switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="风险度强平"
            inactive-text="额度强平线"
          ></el-switch>
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
import { getTimingList } from "@/api/timing/timingList";
import { getPositionList } from "@/api/position/positionList";
import { getServerList } from "@/api/service/serviceList";
import { getGroupList } from "@/api/deposit/depositList";
// import { getMarketList } from "@/api/deal/bazaar";
import {
  addCustomer,
  getCustomerInfo,
  editCustomer,
  getUsers
} from "@/api/client/clientList";

export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "输入操盘账号", trigger: "blur" }],
        user: [{ required: true, message: "选择绑定用户", trigger: "blur" }],
        getGroupVal: [
          { required: true, message: "选择保证金", trigger: "change" }
        ],
        getServerVal: [
          { required: true, message: "选择手续费", trigger: "change" }
        ],
        getPositionVal: [
          { required: true, message: "选择限额", trigger: "change" }
        ],
        getTimingVal: [
          { required: true, message: "选择定时强平分", trigger: "change" }
        ],
        limit: [{ required: true, message: "输入额度强平线", trigger: "blur" }],
        risk: [{ required: true, message: "输入风险度强平", trigger: "blur" }]
      },
      getGroup: [],
      getServer: [],
      getPosition: [],
      getTiming: [],
      outer: {
        options: [],
        value: "",
        list: [],
        loading: false,
        id: ""
      },
      formData: {
        id: "",
        name: "",
        user: "",
        getGroup: "",
        getGroupVal: "",
        getServer: "",
        getServerVal: "",
        getPosition: "",
        getPositionVal: "",
        getTiming: "",
        getTimingVal: "",
        limit: "",
        risk: "",
        switch: false
      }
    };
  },
  created() {
    // this.getGroupList();
  },
  methods: {
    //获取各项列表
    getGroupList() {},
    getData() {
      getUsers().then(res => {
        this.outer.options = res.data.map(item => {
          return { value: `${item.id}`, label: `${item.username}` };
        });
      });
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.id
        };
        getCustomerInfo(data).then(res => {
          if (res.code == 0) {
            this.formData = {
              id: res.data.id,
              name: res.data.trader_acount,
              user: res.data.username,
              userId: res.data.user_id,
              getGroup: res.data.cash_deposit_group_name,
              getGroupVal: res.data.cash_deposit_group_id,
              getServer: res.data.service_fee_group_name,
              getServerVal: res.data.service_fee_group_id,
              getPosition: res.data.positions_quota_group_name,
              getPositionVal: res.data.positions_quota_group_id,
              getTiming: res.data.compulsory_sell_group_name,
              getTimingVal: res.data.compulsory_group_id,
              limit: res.data.compulsory_sell_amount,
              risk: res.data.compulsory_sell_rate,
              switch:
                res.data.compulsory_sell_amount_or_rate == 1 ? false : true
            };
            console.log(this.formData);
          }
        });
      }
      getGroupList().then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res => {
            this.getGroup.push({
              label: res.name,
              value: res.id
            });
          });
        }
      });
      getServerList().then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res => {
            this.getServer.push({
              label: res.name,
              value: res.id
            });
          });
        }
      });
      getPositionList().then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res => {
            this.getPosition.push({
              label: res.name,
              value: res.id
            });
          });
        }
      });
      getTimingList().then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res => {
            this.getTiming.push({
              label: res.name,
              value: res.id
            });
          });
        }
      });
    },
    //获取用户列表
    getCommodityList(query) {
      let data = {
        name: query
      };
      this.outer.loading = true;
      getUsers(data).then(res => {
        this.outer.loading = false;

        this.outer.list = res.data.map(item => {
          return { value: `${item.id}`, label: `${item.username}` };
        });
        this.outer.options = this.outer.list.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      });
    },
    //搜索用户数据
    remoteMethod(query) {
      if (query !== "") {
        console.log(query);
        this.getCommodityList(query);
      } else {
        this.outer.options = [];
      }
    },
    //关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.$refs["formData"].resetFields();
      this.formData = {
        id: "",
        name: "",
        user: "",
        userId: "",
        getGroup: "",
        getGroupVal: "",
        getServer: "",
        getServerVal: "",
        getPosition: "",
        getPositionVal: "",
        getTiming: "",
        getTimingVal: "",
        limit: "",
        risk: "",
        switch: false
      };
      this.getGroup = [];
      this.getServer = [];
      this.getPosition = [];
      this.getTiming = [];
    },
    // 选择状态
    optionVal(val) {
      this.formData.status = val;
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
    eslectCode(val) {
      console.log(val);
      this.formData.userId = val;
    },
    //提交
    confirm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let data = {
            trader_acount: this.formData.name,
            user_id: this.formData.userId,
            cash_deposit_group_id: this.formData.getGroupVal,
            service_fee_group_id: this.formData.getServerVal,
            positions_quota_group_id: this.formData.getPositionVal,
            compulsory_group_id: this.formData.getTimingVal,
            compulsory_sell_amount: this.formData.limit,
            compulsory_sell_rate: this.formData.risk,
            compulsory_sell_amount_or_rate: this.formData.switch ? 2 : 1
          };
          if (this.dialog.dialogType === "edit") {
            data.id = this.formData.id;
            editCustomer(data).then(res => {
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
            addCustomer(data).then(res => {
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