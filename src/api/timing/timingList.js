import request from '@/utils/request'

export function getTimingList(data) {
    return request({
        url: '/api/CompulsorySellGroup/getGroupList',
        method: 'post',
        data
    })
}
export function delGroup(data) {
    return request({
        url: '/api/CompulsorySellGroup/delGroup',
        method: 'post',
        data
    })
}
export function addGroup(data) {
    return request({
        url: '/api/CompulsorySellGroup/addGroup',
        method: 'post',
        data
    })
}
export function getGroupInfo(data) {
    return request({
        url: '/api/CompulsorySellGroup/getGroupInfo',
        method: 'post',
        data
    })
}
export function editGroup(data) {
    return request({
        url: '/api/CompulsorySellGroup/editGroup',
        method: 'post',
        data
    })
}
export function getGoodsGroupServiceFee(data) {
    return request({
        url: '/api/CompulsorySellGroup/getMarketGoods',
        method: 'post',
        data
    })
}
//设置定时平仓
export function setValue(data) {
    return request({
        url: '/api/CompulsorySellGroup/setValue',
        method: 'post',
        data
    })
}
export function getGoodsGroupCompulsorySellData(data) {
    return request({
        url: '/api/CompulsorySellGroup/getGoodsGroupCompulsorySellData',
        method: 'post',
        data
    })
}
export function delData(data) {
    return request({
        url: '/api/CompulsorySellGroup/delData',
        method: 'post',
        data
    })
}