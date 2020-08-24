import request from '@/utils/request'
export function getCurrencyList(data) {
    return request({
      url: '/api/Currency/getCurrencyList',
      method: 'post',
      data
    })
  }
export function addCurrency(data) {
  return request({
    url: '/api/Currency/addCurrency',
    method: 'post',
    data
  })
}
export function editCurrency(data) {
  return request({
    url: '/api/Currency/editCurrency',
    method: 'post',
    data
  })
}
export function delCurrency(data) {
  return request({
    url: '/api/Currency/delCurrency',
    method: 'post',
    data
  })
}
