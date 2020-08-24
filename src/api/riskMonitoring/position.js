import request from '@/utils/request'
//成交明细
export function getbuyedListDetail(data) {
    return request({
        url: 'api/risk/buyListDetail',
        method: 'post',
        data
    })
}
//成交总结
export function sell(data) {
    return request({
        url: 'api/risk/buyListCollectByType',
        method: 'post',
        data
    })
}
//平仓操作
export function sells(data) {
    return request({
        url: 'api/risk/sell',
        method: 'post',
        data
    })
}
//平仓操作
export function buyListCollectByGood(data) {
    return request({
        url: 'api/risk/buyListCollectByGood',
        method: 'post',
        data
    })
}