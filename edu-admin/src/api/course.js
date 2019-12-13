import request from '@/utils/request'

export default {
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/edu-course',
            method: 'post',
            data:courseInfo
        })
    },
    getAllTeacherList(){
        return request({
            url: '/eduservice/edu-teacher',
            method: 'get'
        })
    },
    getCourseInfoById(id){
        return request({
            url: '/eduservice/edu-course/'+id,
            method: 'get'
        })
    }
}