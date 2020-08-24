import request from '@/utils/request'
export function getCapitalDetail(data) {
    return request({
        url: '/api/Capital/getCapitalDetail',
        method: 'post',
        data
    })
}