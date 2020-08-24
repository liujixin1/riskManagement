<template>
  <div class="container">
    <el-form class="form" :model="formData" label-position="left" label-width="30%">
      <el-form-item label="用户名：">
        <span class="item">{{formData.admin_info?formData.admin_info.username:''}}</span>
      </el-form-item>

      <el-form-item label="手机号：">
        <span class="item">{{formData.admin_info?formData.admin_info.phone:''}}</span>
      </el-form-item>
      <el-form-item label="Email：">
        <span class="item">{{formData.admin_info?formData.admin_info.email:''}}</span>
      </el-form-item>
      <el-form-item label="更新时间：">
        <span class="item">{{formData.admin_info?formData.admin_info.last_active_time:''}}</span>
      </el-form-item>
      <el-form-item label="脚本状态：">
        <span v-if="messageType" style="border:0px solid #fff" class="item">{{message}}</span>
        <span v-else style="border:0px solid #fff;color:red" class="item">{{message}}</span>
      </el-form-item>
    </el-form>
    <div class="btnList">
      <el-button
        style="margin-left:50px;margin-top:20px"
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="edtname"
      >编辑</el-button>
      <el-button
        style="margin-left:50px;margin-top:20px"
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="passWord"
      >修改密码</el-button>
    </div>
    <!-- 修改信息dialog -->
    <addpeopleinfo :dialog="dialog" :user="user" @upData="getInfo"></addpeopleinfo>
    <!-- 修改密码dialog -->
    <passWordDialog :passWordDialogs="passWordDialogs"></passWordDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getInfo, getHangQingTime } from "@/api/user";
import Addpeopleinfo from "@/components/addpeopleinfo";
import PassWordDialog from "@/components/passWordDialog";
import { getToken } from "@/utils/auth";
export default {
  components: {
    addpeopleinfo: Addpeopleinfo,
    passWordDialog: PassWordDialog
  },
  data() {
    return {
      passWordDialogs: {
        centerDialogVisible: false
      },
      dialog: {
        centerDialogVisible: false,
        dialogType: ""
      },
      formData: {},
      user: {
        nickname: "",
        phone: "",
        email: ""
      },
      message: "",
      messageType: true,
      baseUrl: "",
      clearTime: null
    };
  },
  //调用用户信息接口
  created() {
    this.getInfo();
    this.time();
    this.baseUrl = this.$axios.default.baseURL;
  },
  methods: {
    //修改事件
    edtname() {
      this.user.nickname = this.formData.admin_info.username;
      this.user.phone = this.formData.admin_info.phone;
      this.user.email = this.formData.admin_info.email;
      this.dialog.centerDialogVisible = true;
    },
    //修改密码
    passWord() {
      this.passWordDialogs.centerDialogVisible = true;
    },
    getInfo() {
      const that = this;
      getInfo().then(res => {
        this.formData = res.data;
      });
      getHangQingTime().then(res => {
        if (res.code == 0) {
          this.message = res.message;
          if (res.message == "脚本执行正常") {
            this.messageType = true;
          } else {
            this.messageType = false;
          }
        }
      });
    },
    time() {
      const that = this;
      var timer_num = 60;
      let data = {
        token: getToken()
      };
      this.clearTime = setInterval(function() {
        timer_num--;
        if (timer_num == 0) {
          timer_num = 60;
          that.$axios.post("/api/setting/getHangQingTime", data).then(res => {
            if (res.data.code == 0) {
              that.message =res.data.message;
              if (res.data.message == "脚本执行正常") {
                that.messageType = true;
              } else {
                that.messageType = false;
              }
            }
          });
        }
      }, 1000);
    }
  },
  destroyed() {
    clearInterval(this.clearTime);
  }
};
</script>

<style scoped>
.dashboard-text {
  width: 150px;
  display: inline-block;
}
.form {
  width: 400px;
}
.el-form-item {
  height: 40px;
  overflow: hidden;
}
.item {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>
