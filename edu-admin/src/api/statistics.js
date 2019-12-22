import request from '@/utils/request'
export default {
    createStatistics(day) {
        return request({
            url: '/statistics/daily/getStatisticsDay/' + day,
            method: 'get'
        })
    },
    showChart(searchObj) {
        return request({
            url: `/statistics/daily/getCountData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get'
        })
    }
}