<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in oneLevelList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in twoLevelList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题" />
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select v-model="searchObj.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getAllCourse()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px" />
            </div>
            <div class="title">
              <a href>{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.gmtCreate.substr(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">{{ scope.row.gmtModified.substr(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :
          '¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="buyCount" label="购买人数" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.buyCount }}人</template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/course/info/'+scope.row.id}">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getAllCourse"
    />
  </div>
</template>
<script>
import course from "@/api/course";
import subject from "@/api/subject";
export default {
  data() {
    return {
      //定义变量
      list: null, //每页list数据集合
      total: 0,
      page: 1,
      limit: 10,
      searchObj: {},
      teacherList: [],
      oneLevelList: [],
      twoLevelList: []
    };
  },
  created() {
    this.getAllCourse();
    this.initTeacherList();
    this.initSubjectList();
  },
  methods: {
    getAllCourse(page = 1) {
      this.page = page;
      this.listLoading = true;
      course
        .getCourseList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(response => {});
    },
    initTeacherList() {
      course
        .getAllTeacherList()
        .then(response => {
          this.teacherList = response.data.items;
        })
        .catch(response => {});
    },
    initSubjectList() {
      subject
        .getAllSubjectList()
        .then(response => {
          this.oneLevelList = response.data.items;
        })
        .catch(response => {});
    },
    subjectLevelOneChanged(value) {
      for (var i = 0; i < this.oneLevelList.length; i++) {
        var levelOne = this.oneLevelList[i];
        if (levelOne.id === value) {
          this.twoLevelList = levelOne.children;
        }
      }
    },
    removeDataById(id) {
      //调用方法删除
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //return表示后面的then还会执行
          return course.deleteCourseById(id);
        })
        .then(() => {
          //刷新整个页面
          this.getAllCourse();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(response => {
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
    },
    resetData() {
      this.searchObj = {};
      this.twoLevelList = []; // 二级分类列表
      this.getAllCourse();
    }
  }
};
</script>

<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}
.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}
.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.myClassList .info .pic img {
  display: block;
  width: 100%;
}
.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}
.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}
.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>