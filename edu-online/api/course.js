import request from '@/utils/request'
const api_name = '/eduservice/frontCourseInfo'
export default {
    getPageList(page, limit) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get'
        })
    },
    getInfoById(courseId) {
        return request({
            url: `${api_name}/${courseId}`,
            method: 'get'
        })
    }
}