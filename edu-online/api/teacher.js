import request from '@/utils/request'
const api_name = '/eduservice/frontTeacher'
export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get'
        })
    },
    getInfoById(teacherId) {
        return request({
            url: `${api_name}/${teacherId}`,
            method: 'get'
        })
    }
}