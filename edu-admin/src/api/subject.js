import request from '@/utils/request'

export default {
    getAllSubjectList() {
        return request({
            url: '/eduservice/edu-subject',
            method: 'get'
          })
    },
    removeSubjectId(id) {
        return request({
            url: '/eduservice/edu-subject/'+id,
            method: 'delete'
        })
    },
    addSubjectOne(subject) {
        return request({
            url: '/eduservice/edu-subject/addOneLevel',
            method: 'post',
            data:subject
        })
    },
    addSubjectTwo(subject) {
        return request({
            url: '/eduservice/edu-subject/addTwoLevel',
            method: 'post',
            data:subject
        })
    }
}