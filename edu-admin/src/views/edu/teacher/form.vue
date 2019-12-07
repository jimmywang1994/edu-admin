<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import teacher from '@/api/teacher'
    const defaultForm = {
        name: '',
        sort: 0,
        level: '',
        career: '',
        intro: '',
        avatar: ''
    }
    export default {
        data(){
            return {
                //设置teacher对象的初始值
                teacher:{
                    name:'',
                    sort:0,
                    level:'',
                    carrer:'',
                    intro:''
                }
            }
        },
        watch: {
            $route(to, from) {
                console.log('watch $route')
                this.init()
            }
        },
        created(){
           this.init()
        },
        methods:{
            init(){
                //在页面加载之前判断路由里是否有id值
                //修改数据回显
                if(this.$route.params&&this.$route.params.id){
                    const id=this.$route.params.id
                    this.getTeacherById(id)
                }else{//添加
                    this.teacher={...defaultForm}
                }
            },
            //添加修改用一个表单
            saveOrUpdate(){
                //判断点击保存是添加还是修改
                if(!this.teacher.id){
                    this.saveTeacher()  
                }else{
                    this.updateTeacher(this.teacher.id)    
                }
               
            },
            //根据id查询
            getTeacherById(id){
                teacher.getTeacherById(id)
                .then(response=>{
                    this.teacher=response.data.eduTeacher
                }).catch(
                    response=>{
                        this.updateTeacher()
                    }
                )
            },
            //添加方法
            saveTeacher(){
                //调用后台接口
                teacher.saveTeacher(this.teacher)
                .then(()=>{
                    return this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                })
                .then(()=>{
                    //回到列表页面中,通过路由功能
                    this.$router.push({ path: '/teacher' })
                })
                .catch(()=>{
                    this.$message({
                     type: 'error',
                     message: '添加失败!'
                    })
                })
            },
            //修改方法
            updateTeacher(){
                //调用后台接口
                teacher.updateTeacher(this.teacher.id,this.teacher)
                .then(()=>{
                    return this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                })
                .then(()=>{
                    //回到列表页面中,通过路由功能
                    this.$router.push({ path: '/teacher' })
                })
                .catch(()=>{
                    this.$message({
                     type: 'error',
                     message: '修改失败!'
                    })
                })
            }
        }
    }
</script>