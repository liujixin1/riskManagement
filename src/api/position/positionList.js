import request from '@/utils/request'

export function getPositionList(data) {
  return request({
    url: '/api/PositionsQuotaGroup/getGroupList',
    method: 'post',
    data
  })
}
export function delGroup(data) {
  return request({
    url: '/api/PositionsQuotaGroup/delGroup',
    method: 'post',
    data
  })
}
//添加持仓限额分组
export function addGroup(data) {
  return request({
    url: '/api/PositionsQuotaGroup/addGroup',
    method: 'post',
    data
  })
}
//获取某分组信息
export function getGroupInfo(data) {
  return request({
    url: '/api/PositionsQuotaGroup/getGroupInfo',
    method: 'post',
    data
  })
}
//修改持仓限额分组
export function editGroup(data) {
  return request({
    url: '/api/PositionsQuotaGroup/editGroup',
    method: 'post',
    data
  })
}
//市场中品种列表
export function getGoodsGroupServiceFee(data) {
  return request({
    url: '/api/PositionsQuotaGroup/getGoodsGroupPositionsQuota',
    method: 'post',
    data
  })
}
//设置持仓限额
export function setGoodsGroupServiceFee(data) {
  return request({
    url: '/api/PositionsQuotaGroup/setGoodsGroupPositionsQuota',
    method: 'post',
    data
  })
}
//检查是否有没有设置的品种
export function check(data) {
  return request({
    url: '/api/PositionsQuotaGroup/check',
    method: 'post',
    data
  })
}