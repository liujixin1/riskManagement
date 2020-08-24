import request from '@/utils/request'
//成交明细
export function getbuyedListDetail(data) {
    return request({
        url: 'api/risk/getbuyedListDetail ',
        method: 'post',
        data
    })
}
//成交总结
export function sell(data) {
    return request({
        url: 'api/risk/buyedCollectList',
        method: 'post',
        data
    })
}