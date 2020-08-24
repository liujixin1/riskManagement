import request from '@/utils/request'

export function getServerList(data) {
  return request({
    url: '/api/ServiceFeeGroup/getGroupList',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/ServiceFeeGroup/changeStatus',
    method: 'post',
    data
  })
}
export function deltGroup(data) {
  return request({
    url: '/api/ServiceFeeGroup/delGroup',
    method: 'post',
    data
  })
}
//添加手续费分组
export function addGroup(data) {
  return request({
    url: '/api/ServiceFeeGroup/addGroup',
    method: 'post',
    data
  })
}
//获取某分组信息
export function getGroupInfo(data) {
  return request({
    url: '/api/ServiceFeeGroup/getGroupInfo',
    method: 'post',
    data
  })
}
//修改手续费分组
export function editGroup(data) {
  return request({
    url: '/api/ServiceFeeGroup/editGroup',
    method: 'post',
    data
  })
}
//市场中品种列表
export function getGoodsGroupServiceFee(data) {
  return request({
    url: '/api/ServiceFeeGroup/getGoodsGroupServiceFee',
    method: 'post',
    data
  })
}
//设置手续费
export function setGoodsGroupServiceFee(data) {
  return request({
    url: '/api/ServiceFeeGroup/setGoodsGroupServiceFee',
    method: 'post',
    data
  })
}
//检查是否有没有设置手续费的品种
export function check(data) {
  return request({
    url: '/api/ServiceFeeGroup/check',
    method: 'post',
    data
  })
}