import request from '@/utils/request'
export function getGroupList(data) {
    return request({
        url: '/api/CashDepositGroup/getGroupList',
        method: 'post',
        data
    })
}
export function changeStatus(data) {
    return request({
        url: '/api/CashDepositGroup/changeStatus',
        method: 'post',
        data
    })
}
export function addGroup(data) {
    return request({
        url: '/api/CashDepositGroup/addGroup',
        method: 'post',
        data
    })
}
export function getGroupInfo(data) {
    return request({
        url: '/api/CashDepositGroup/getGroupInfo',
        method: 'post',
        data
    })
}
export function delGroup(data) {
  return request({
      url: '/api/CashDepositGroup/delGroup',
      method: 'post',
      data
  })
}
export function editGroup(data) {
    return request({
        url: '/api/CashDepositGroup/editGroup',
        method: 'post',
        data
    })
}
//某保证金分组中某市场品种保证金列表
export function getGoodsGroupServiceFee(data) {
    return request({
      url: '/api/CashDepositGroup/getGoodsGroupCashDeposit',
      method: 'post',
      data
    })
  }
  //设置保证金限额
  export function setGoodsGroupServiceFee(data) {
    return request({
      url: '/api/CashDepositGroup/setGoodsGroupCashDeposit',
      method: 'post',
      data
    })
  }
  //检查是否有没有设置手续费的品种
  export function check(data) {
    return request({
      url: '/api/CashDepositGroup/check',
      method: 'post',
      data
    })
  }
  export function getGoodsCashDepositList(data) {
    return request({
      url: '/api/Goods/getGoodsCashDepositList',
      method: 'post',
      data
    })
  }