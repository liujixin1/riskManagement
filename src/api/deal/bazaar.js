import request from '@/utils/request'
export function getMarketList(data) {
  return request({
    url: '/api/Market/getMarketList',
    method: 'post',
    data
  })
}
export function addMarket(data) {
  return request({
    url: '/api/Market/addMarket',
    method: 'post',
    data
  })
}
export function editMarket(data) {
  return request({
    url: '/api/Market/editMarket',
    method: 'post',
    data
  })
}
export function delMarket(data) {
  return request({
    url: '/api/Market/delMarket',
    method: 'post',
    data
  })
}
export function changeDealStatus(data) {
  return request({
    url: '/api/Market/changeDealStatus',
    method: 'post',
    data
  })
}