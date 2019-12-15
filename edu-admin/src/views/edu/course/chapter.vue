<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="openAddChapter()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
            <el-button style type="text" @click="getChapterById(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openVideoEditDialog(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVidoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>

        <!--上传按钮实现视频上传-->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vidservice/vod/upload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVidoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/chapter";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      id: "",
      chapterVideoList: [],
      //小节对象
      video: {
        title: "",
        sort: "",
        chapterId: "",
        courseId: "",
        videoSourceId: "",
        videoOriginalName: "" //视频名称
      },
      dialogChapterFormVisible: false, //是否显示章节表单
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
        courseId: ""
      }
    };
  },

  created() {
    console.log("info created");
    this.init();
    this.getChapterVideoById(this.id);
  },

  methods: {
    openAddChapter() {
      //弹出框
      this.dialogChapterFormVisible = true;
      //表单清空
      this.chapter.title = "";
      this.chapter.sort = "";
      this.chapter.courseId = "";
    },
    init() {
      //获取路由中参数
      if (this.$route.params && this.$route.params.id) {
        this.id = this.$route.params.id;
      }
      console.log(this.id);
    },
    //保存或修改方法
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.saveChapter();
      } else {
        this.updateChapter();
      }
    },
    saveChapter() {
      this.chapter.courseId = this.id;
      chapter
        .addChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false;
          this.$message({
            type: "success",
            message: "添加章节成功!"
          });
          //刷新页面
          this.getChapterVideoById(this.id);
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "添加章节失败!"
          });
        });
    },
    updateChapter() {
      chapter
        .updateChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false;
          this.$message({
            type: "success",
            message: "修改章节成功!"
          });
          //刷新页面
          this.getChapterVideoById(this.id);
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "修改章节失败!"
          });
        });
    },
    getChapterById(id) {
      this.dialogChapterFormVisible = true;
      chapter
        .getChapterInfo(id)
        .then(response => {
          this.chapter = response.data.eduChapter;
        })
        .catch(response => {});
    },
    getChapterVideoById(id) {
      chapter
        .getAllChapterVideoList(id)
        .then(response => {
          this.chapterVideoList = response.data.items;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "数据加载失败!"
          });
        });
    },
    next() {
      console.log("next");
      this.$router.push({ path: "/course/publish/" + this.id });
    },

    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/info/" + this.id });
    }
  }
};
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>