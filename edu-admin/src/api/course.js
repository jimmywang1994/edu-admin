import request from '@/utils/request'

export default {
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/edu-course',
            method: 'post',
            data: courseInfo
        })
    },
    getAllTeacherList() {
        return request({
            url: '/eduservice/edu-teacher',
            method: 'get'
        })
    },
    getCourseInfoById(id) {
        return request({
            url: '/eduservice/edu-course/' + id,
            method: 'get'
        })
    },
    updateCourseInfoById(courseInfo) {
        return request({
            url: '/eduservice/edu-course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    getCourseList(page, limit, searchObj) {
        return request({
            url: '/eduservice/edu-course/pageList/' + page + '/' + limit,
            method: 'post',
            data:searchObj
        })
    },
    deleteCourseById(id){
        return request({
            url: '/eduservice/edu-course/deleteCourse/'+id,
            method: 'delete'
        })
    },
    getAllCourseInfo(id){
        return request({
            url: '/eduservice/edu-course/getAllCourseInfo/'+id,
            method: 'get'
        })
    }
}