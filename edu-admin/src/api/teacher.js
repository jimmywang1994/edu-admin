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
    }
}
