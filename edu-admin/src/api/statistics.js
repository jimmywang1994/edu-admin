import request from '@/utils/request'
export default {
    createStatistics(day) {
        return request({
            url: '/statistics/daily/getStatisticsDay/' + day,
            method: 'get'
        })
    },
}