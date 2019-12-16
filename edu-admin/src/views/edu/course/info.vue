<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subJectLevelOneChanged"
        >
          <el-option
            v-for="subject in oneLevelList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in twoLevelList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduservice/oss/upload?host=cover'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/course";
import subject from "@/api/subject";
import Tinymce from "@/components/Tinymce";
const defaultForm = {
  title: "",
  subjectId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: process.env.OSS_PATH + "/default/cover/idea快捷键.jpg",
  price: 0
};
export default {
  components: { Tinymce },
  init() {
    //在页面加载之前判断路由里是否有id值
    //修改数据回显
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      //course.getTeacherById(id)
    } else {
      //添加
      this.courseInfo = { ...courseInfo };
    }
  },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList: [],
      courseInfo: defaultForm,
      oneLevelList: [], //一级分类
      twoLevelList: [], //二级分类
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },
  watch: {
    $route(to, from) {
      console.log("watch $route");
      this.init();
    }
  },
  created() {
    this.init();
  },

  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传课程图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传课程图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.imgUrl;
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        //根据id查询，做数据回显
        const id = this.$route.params.id;
        //调用方法，根据id查询
        this.getIdCourse(id);
      } else {
        //添加表单部分
        //没有id值
        this.courseInfo = { ...defaultForm };
        //调用获取所有的讲师的方法
        this.getTeacherList();
        //调用获取一级分类信息
        this.getLevelAll();
      }
    },
    //根据id查询出课程信息
    getIdCourse(id) {
      course
        .getCourseInfoById(id)
        .then(response => {
          this.courseInfo = response.data.courseInfoForm;
          //1 查询所有的一级分类
          subject.getAllSubjectList().then(response => {
            this.oneLevelList = response.data.items;
            //2 遍历一级分类集合
            for (var i = 0; i < this.oneLevelList.length; i++) {
              //3 获取每个一级分类
              var levelOne = this.oneLevelList[i];
              //4 判断：每个一级分类id和课程所属一级分类id是否相同
              if (levelOne.id === this.courseInfo.subjectParentId) {
                //5 获取这个一级分类里面的所有的二级分类
                this.twoLevelList = levelOne.children;
              }
            }
          });
          //调用获取所有的讲师的方法
          this.getTeacherList();
        })
        .catch(response => {});
    },
    getTeacherList() {
      course
        .getAllTeacherList()
        .then(response => {
          this.teacherList = response.data.items;
        })
        .catch(response => {});
    },
    next() {
      //判断课程对象是否有id
      if (!this.courseInfo.id) {
        this.addCourse();
      } else {
        this.updateCourse();
      }
    },
    //触发二级联动
    subJectLevelOneChanged(value) {
      for (var i = 0; i < this.oneLevelList.length; i++) {
        var levelOne = this.oneLevelList[i];
        console.log(levelOne);
        if (levelOne.id === value) {
          this.twoLevelList = levelOne.children;
          this.courseInfo.subjectId = "";
        }
      }
    },
    //获取所有分类信息
    getLevelAll() {
      subject
        .getAllSubjectList()
        .then(response => {
          this.oneLevelList = response.data.items;
        })
        .catch(response => {});
    },
    addCourse() {
      course
        .addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: "success",
            message: "添加课程信息成功!"
          });
          return response;
        })
        .then(response => {
          this.$router.push({
            path: "/course/chapter/" + response.data.courseId
          });
        })
        .catch(response => {
          return this.$message({
            type: "error",
            message: "添加课程信息失败!"
          });
        });
    },
    updateCourse() {
      course
        .updateCourseInfoById(this.courseInfo)
        .then(response => {
          return this.$message({
            type: "success",
            message: "修改课程信息成功!"
          });
          return response;
        })
        .then(response => {
          this.$router.push({
            path: "/course/chapter/" + this.courseInfo.id
          });
        })
        .catch(response => {
          return this.$message({
            type: "error",
            message: "修改课程信息失败!"
          });
        });
    }
  }
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>