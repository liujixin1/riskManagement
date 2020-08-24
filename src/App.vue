<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getList } from "@/api/user";
export default {
  name: "App",
  data() {
    return {
      token: "",
    };
  },
  created() {
    // let time = setInterval((res) => {
    //   if (getToken()) {
    //     this.getListData();
    //     clearInterval(time);
    //   } else {
    //   }
    // }, 1000);
  },
  methods: {
    // getListData() {
    //   getList()
    //     .then((res) => {
    //       if (res.code == 0) {
    //         res.data.forEach((result, index) => {
    //           setTimeout(() => {
    //             if (result.type == 1) {
    //               this.$notify({
    //                 title: "",
    //                 dangerouslyUseHTMLString: true,
    //                 duration: 0,
    //                 message: `
    //                 <strong>操盘账号：${result.data.trader_acount}</strong><br/>
    //                 <strong>操盘人姓名：${result.data.user_realname}</strong><br/>
    //                 <strong>操盘人账户：${result.data.user_username}</strong><br/>
    //                 <strong>类型：${result.data.notice_type}</strong><br/>
    //                 <strong>合约名称：${result.data.goods_name}</strong><br/>
    //                 <strong>数量：${result.data.buy_count}</strong><br/>
    //                 <strong>买涨买跌：${result.data.buy_type}</strong><br/>
    //                 <strong>下单时间：${result.data.create_time}</strong>`,
    //               });
    //             }
    //           }, 1000);
    //         });
    //       }
    //     })
    //     .then(() => {
    //       setInterval(() => {
    //         let res = {
    //           code: 0,
    //           data: [
    //             {
    //               created_at: "2020-08-19 15:29:34",
    //               data: {
    //                 buy_count: "1.00",
    //                 buy_type: "买涨",
    //                 create_time: "2020-08-19 15:29:34",
    //                 goods_code: "HSI2008",
    //                 goods_name: "恒指期货",
    //                 notice_type: "平仓单",
    //                 trader_acount: "CE000001",
    //                 user_realname: "于壮士",
    //                 user_username: "13361249026",
    //               },
    //               id: 444,
    //               status: 1,
    //               type: 1,
    //               update_at: "2020-08-20 17:18:15",
    //             },
    //             {
    //               created_at: "2020-08-19 15:29:34",
    //               data: {
    //                 buy_count: "1.00",
    //                 buy_type: "买涨",
    //                 create_time: "2020-08-19 15:29:34",
    //                 goods_code: "HSI2008",
    //                 goods_name: "恒指期货",
    //                 notice_type: "平仓单",
    //                 trader_acount: "CE000001",
    //                 user_realname: "于壮士",
    //                 user_username: "13361249026",
    //               },
    //               id: 443,
    //               status: 1,
    //               type: 1,
    //               update_at: "2020-08-20 17:18:15",
    //             },
    //           ],
    //           message: "获取成功"
    //         };
    //         // this.$axios({
    //         //   method: "post",
    //         //   url: "api/notice/getList",
    //         //    headers: {'X-Token':  getToken()}
    //         // }).then(res => {
    //           if (res.code == 0) {
    //             res.data.forEach((result, index) => {
    //               setTimeout(() => {
    //                 if (result.type == 1) {
    //                   this.$notify({
    //                     title: "",
    //                     dangerouslyUseHTMLString: true,
    //                     duration: 0,
    //                     message: `
    //                 <strong>操盘账号：${result.data.trader_acount}</strong><br/>
    //                 <strong>操盘人姓名：${result.data.user_realname}</strong><br/>
    //                 <strong>操盘人账户：${result.data.user_username}</strong><br/>
    //                 <strong>类型：${result.data.notice_type}</strong><br/>
    //                 <strong>合约名称：${result.data.goods_name}</strong><br/>
    //                 <strong>数量：${result.data.buy_count}</strong><br/>
    //                 <strong>买涨买跌：${result.data.buy_type}</strong><br/>
    //                 <strong>下单时间：${result.data.create_time}</strong>`
    //                   });
    //                 }
    //               }, 1000);
    //             });
    //           }
    //         // });
    //       }, 2000);
    //     });
    // },
  },
};
</script>
<style>
.container {
  padding: 20px;
}
.el-date-editor .el-range-separator {
  width: 8% !important;
}
.el-notification {
  width: 270px !important;
}
</style>
