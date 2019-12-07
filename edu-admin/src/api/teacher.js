import request from '@/utils/request' //模板提供的组件

export default {
    //分页条件查询的方法
    getTeacherPageList(page,limit,searchObj){
        return request({
            url:'/eduservice/edu-teacher/moreConditionPageList/'+page+'/'+limit,
            method:'post',
            //传递条件对象，如果传递json数据，使用data
            data:searchObj
        })
    },
    deleteTeacherById(id){
        return request({
            url:'/eduservice/edu-teacher/'+id,
            method:'delete'
        })
    },
    //添加方法
    saveTeacher(teacher){
        return request({
            url:'/eduservice/edu-teacher/addTeacher',
            method:'post',
            data:teacher
        })
    },
    //根据id查讲师
    getTeacherById(id){
        return request({
            url:'/eduservice/edu-teacher/getTeacherInfo/'+id,
            method:'get'
        })
    },
    //根据id修改讲师
    updateTeacher(id,teacher){
        return request({
            url:'/eduservice/edu-teacher/updateTeacher/'+id,
            method:'post',
            data:teacher
        })
    }
}
