<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改品种':'创建品种'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @close="closed"
      @open="getData"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="品种名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入市场名称" />
        </el-form-item>
        <el-form-item label="品种编码：" prop="code">
          <el-input v-model="formData.code" placeholder="请输品种编码" />
        </el-form-item>
        <el-form-item label="一个点的价格：" prop="one_point_price">
          <el-input v-model="formData.one_point_price" placeholder="请输一个点的价格" />
        </el-form-item>
        <el-form-item label="最小跳动值：" prop="min_point">
          <el-input v-model="formData.min_point" placeholder="请输一个点的价格" />
        </el-form-item>
        <el-form-item label="市场编码：" prop="market_name">
          <el-select
            v-model="formData.market_name"
            :multiple="false"
            filterable
            remote
            reserve-keyword
            placeholder="请输市场编码"
            :remote-method="remoteMethod"
            :loading="outer.loading"
            @change="eslectCode(formData.market_name)"
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

        <el-form-item label="币种：" prop="currencyMsg">
          <el-select
            v-model="formData.currencyMsg"
            @change="currencyVal(formData.currencyMsg)"
            placeholder="请选择币种"
          >
            <el-option
              v-for="item in getCurrency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场状态：" prop="statusMsg">
          <el-select
            v-model="formData.statusMsg"
            @change="optionVal(formData.statusMsg)"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
import { getCurrencyList } from "@/api/currency/settingCurrency";
import { getMarketList } from "@/api/deal/bazaar";
import { addGoods, editGoods, getGoodsInfo } from "@/api/deal/variety";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写市场名称", trigger: "blur" }],
        code: [{ required: true, message: "填写品种编码", trigger: "blur" }],
        market_name: [
          { required: true, message: "填写市场编码", trigger: "change" }
        ],
        one_point_price: [
          { required: true, message: "填写一个点的价格", trigger: "blur" }
        ],
        min_point: [
          { required: true, message: "填写最小跳动值", trigger: "blur" }
        ],
        statusMsg: [
          { required: true, message: "选择市场状态", trigger: "change" }
        ],
        currencyMsg: [
          { required: true, message: "选择币种", trigger: "change" }
        ]
      },
      getCurrency: [],
      options: [
        {
          value: "1",
          label: "允许交易"
        },
        {
          value: "0",
          label: "禁止交易"
        },
        {
          value: "2",
          label: "只可平仓"
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
        name: "",
        code: "",
        market_name: "",
        marketCode: "",
        one_point_price: "",
        min_point: "",
        status: "",
        statusMsg: "",
        currencyMsg: "",
        currency_id: ""
      }
    };
  },
  created() {
    this.getCurrencyList();
  },
  methods: {
    //获取币种列表
    getCurrencyList() {
      getCurrencyList().then(res => {
        if (res.code == 0) {
          res.data.data.forEach(res => {
            this.getCurrency.push({
              label: res.name,
              value: res.id
            });
          });
        }
      });
    },
    getData() {
      let data = {
        page: 1,
        is_storage: 1,
        limit: 100
      };
      getMarketList(data).then(res => {
        this.outer.options = res.data.data.map(item => {
          return { value: `${item.code}`, label: `${item.code}` };
        });
      });
      if (this.dialog.dialogType === "edit") {
        let data = {
          id: this.dialog.id
        };
        getGoodsInfo(data).then(res => {
          if (res.code == 0) {
            switch (res.data.status) {
              case 0:
                res.data.statusMsg = "禁止交易";
                break;
              case 1:
                res.data.statusMsg = "允许交易";
                break;
              case 2:
                res.data.statusMsg = "只可平仓";
                break;
            }
            this.formData = {
              id: res.data.id,
              name: res.data.name,
              code: res.data.goods_code,
              market_name: res.data.market_code,
              marketCode: res.data.market_code,
              one_point_price: res.data.one_point_price,
              min_point: res.data.min_point,
              status: res.data.status,
              statusMsg: res.data.statusMsg,
              currencyMsg: res.data.currency_name,
              currency_id: res.data.currency_id
            };
            console.log(this.formData);
          }
        });
      }
    },
    //获取商品列表
    getCommodityList(query) {
      let data = {
        search: query,
        page: 1,
        is_storage: 1,
        limit: 100
      };
      this.outer.loading = true;
      getMarketList(data).then(res => {
        this.outer.list = res.data.data.map(item => {
          return { value: `${item.code}`, label: `${item.code}` };
        });
        this.outer.loading = false;
        this.outer.options = this.outer.list.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
        this.commodityList = res.data.data;
      });
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
    //获取市场Code
    eslectCode(code) {
      this.formData.marketCode = code;
      console.log(this.formData, code);
    },
    //关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
    },
    //弹出清除状态
    closed() {
      this.$refs["formData"].resetFields();
    },
    // 选择状态
    optionVal(val) {
      this.formData.status = val;
    },
    //选择币种
    currencyVal(val) {
      this.formData.currency_id = val;
    },
    //提交
    confirm() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let data = {
            name: this.formData.name,
            goods_code: this.formData.code,
            market_code: this.formData.marketCode,
            one_point_price: this.formData.one_point_price,
            min_point: this.formData.min_point,
            currency_id: this.formData.currency_id,
            status: this.formData.status
          };
          console.log(data);
          if (this.dialog.dialogType === "edit") {
            data.id = this.formData.id;
            editGoods(data).then(res => {
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
            addGoods(data).then(res => {
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