import request from '@/utils/request'
export function getCustomerList(data) {
  return request({
    url: '/api/Customer/getCustomerList',
    method: 'post',
    data
  })
}
export function addCustomer(data) {
  return request({
    url: '/api/Customer/addCustomer',
    method: 'post',
    data
  })
}
export function getCustomerInfo(data) {
  return request({
    url: '/api/Customer/getCustomerInfo',
    method: 'post',
    data
  })
}
export function delCustomer(data) {
  return request({
    url: '/api/Customer/delCustomer',
    method: 'post',
    data
  })
}
export function editCustomer(data) {
  return request({
    url: '/api/Customer/editCustomer',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/Customer/changeStatus',
    method: 'post',
    data
  })
}
export function getUsers(data) {
  return request({
    url: 'api/Customer/getUsers',
    method: 'post',
    data
  })
}