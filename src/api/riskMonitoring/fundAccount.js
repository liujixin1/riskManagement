import request from '@/utils/request'
//高风险用户信息
export function highPlaceCustomer(data) {
    return request({
        url: 'api/risk/highPlaceCustomer',
        method: 'post',
        data
    })
}
//中风险用户信息
export function middlePlaceCustomer(data) {
    return request({
        url: 'api/risk/middlePlaceCustomer',
        method: 'post',
        data
    })
}
//低风险用户信息
export function lowPlaceCustomer(data) {
    return request({
        url: 'api/risk/lowPlaceCustomer',
        method: 'post',
        data
    })
}
//自有用户信息
export function selfPlaceCustomer(data) {
    return request({
        url: 'api/risk/selfPlaceCustomer',
        method: 'post',
        data
    })
}
//用户持仓详情
export function customerBuyDetail(data) {
    return request({
        url: 'api/risk/customerBuyDetail',
        method: 'post',
        data
    })
}
//平仓操作
export function sell(data) {
    return request({
        url: 'api/risk/sell',
        method: 'post',
        data
    })
}
//添加到自选区
export function addSelfPlace(data) {
    return request({
        url: 'api/risk/addSelfPlace',
        method: 'post',
        data
    })
}
//删除自选区
export function deleteSelfPlace(data) {
    return request({
        url: 'api/risk/deleteSelfPlace',
        method: 'post',
        data
    })
}