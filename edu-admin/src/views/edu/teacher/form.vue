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
    <!-- 讲师头像 -->
    <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
                    v-show="imagecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduservice/oss/upload'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>

    </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import teacher from '@/api/teacher'
    import ImageCropper from '@/components/ImageCropper'
    import PanThumb from '@/components/PanThumb'
    const defaultForm = {
        name: '',
        sort: 0,
        level: '',
        career: '',
        intro: '',
        avatar: 'http://edu-demo12.oss-cn-shanghai.aliyuncs.com/2019/12/08/b9e5edc7-6299-4f7c-bc78-25e938a7aa08file.png'
    }
    export default {
        //声明使用的额外组件
        components:{ImageCropper,PanThumb},
        data(){
            return {
                //设置teacher对象的初始值
                teacher : defaultForm,
                BASE_API: process.env.BASE_API, // 接口API地址
                imagecropperShow: false, // 是否显示上传组件
                imagecropperKey: 0 // 上传组件id
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
            },
            // 上传成功后的回调函数
            cropSuccess(data) {
               this.imagecropperShow=false
               this.teacher.avatar=data.imgUrl
               // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
               this.imagecropperKey = this.imagecropperKey + 1
            },

            // 关闭上传组件
            close() {
               this.imagecropperShow = false
               this.imagecropperKey = this.imagecropperKey + 1
            }
        }
    }
</script>