import request from '@/utils/request'
export function getGoodsList(data) {
  return request({
    url: '/api/Goods/getGoodsList',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/Goods/changeStatus',
    method: 'post',
    data
  })
}
export function addGoods(data) {
  return request({
    url: '/api/Goods/addGoods',
    method: 'post',
    data
  })
}
export function getGoodsInfo(data) {
  return request({
    url: '/api/Goods/getGoodsInfo',
    method: 'post',
    data
  })
}
export function editGoods(data) {
  return request({
    url: '/api/Goods/editGoods',
    method: 'post',
    data
  })
}
export function delGoods(data) {
  return request({
    url: '/api/Goods/delGoods',
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
export function addGoodsCashDeposit(data) {
  return request({
    url: '/api/Goods/addGoodsCashDeposit',
    method: 'post',
    data
  })
}
export function delGoodsCashDeposit(data) {
  return request({
    url: '/api/Goods/delGoodsCashDeposit',
    method: 'post',
    data
  })
}
export function addCashDepositData(data) {
  return request({
    url: '/api/Goods/addCashDepositData',
    method: 'post',
    data
  })
}
export function getCashDepositDataList(data) {
  return request({
    url: '/api/Goods/getCashDepositDataList',
    method: 'post',
    data
  })
}
//获取保证金数据信息
export function getCashDepositDataInfo(data) {
  return request({
    url: '/api/Goods/getCashDepositDataInfo',
    method: 'post',
    data
  })
}
//修改保证金数据信息
export function editCashDepositData(data) {
  return request({
    url: '/api/Goods/editCashDepositData',
    method: 'post',
    data
  })
}
//删除保证金数据信息
export function delCashDepositData(data) {
  return request({
    url: '/api/Goods/delCashDepositData',
    method: 'post',
    data
  })
}