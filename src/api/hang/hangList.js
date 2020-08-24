import request from '@/utils/request'
export function hangBuyList(data) {
    return request({
        url: 'api/risk/hangBuyList',
        method: 'post',
        data
    })
}
export function cancelHangBuy(data) {
    return request({
        url: 'api/risk/cancelHangBuy',
        method: 'post',
        data
    })
}