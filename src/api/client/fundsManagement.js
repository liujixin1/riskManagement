import request from '@/utils/request'
export function getCapitalList(data) {
  return request({
    url: '/api/Capital/getCapitalList',
    method: 'post',
    data
  })
}
export function addCapital(data) {
  return request({
    url: '/api/Capital/addCapital',
    method: 'post',
    data
  })
}
export function getCapitalInfo(data) {
  return request({
    url: '/api/Capital/getCapitalInfo',
    method: 'post',
    data
  })
}
export function editCapital(data) {
  return request({
    url: '/api/Capital/editCapital',
    method: 'post',
    data
  })
}
export function delCapital(data) {
  return request({
    url: '/api/Capital/delCapital',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/Capital/changeStatus',
    method: 'post',
    data
  })
}