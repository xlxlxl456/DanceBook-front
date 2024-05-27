<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { studentListService } from '@/api/student';

const students=ref([])
const studentModel=ref({
    username:'',
    phone:'',
    email:''
})

const pageNum=ref(1)
const pageSize=ref(5)
const total=ref(10)

const visibleDrawer=ref(false)

const studentList=async()=>{
    let params={
        pageNum:pageNum.value,
        pageSize:pageSize.value
    }

    let result = await studentListService(params)
    total.value = result.data.total
    students.value = result.data.items
}
studentList()

const onSizeChange=(size)=>{
    pageSize.value = size
    studentList()
}
const onCurrentChange=(num)=>{
    pageNum.value = num
    studentList()
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>学生一覧</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true">学生追加</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <!-- <el-form inline>
            <el-form-item class="searchPullDown" label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="searchPullDown" label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="Released"></el-option>
                    <el-option label="草稿" value="Draft"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId='';state=''">重置</el-button>
            </el-form-item>
        </el-form> -->
        <!-- 文章列表 -->
        <el-table :data="students" style="width: 100%">
            <el-table-column label="名前" width="400" prop="username"></el-table-column>
            <el-table-column label="電話番号" prop="phone"></el-table-column>
            <el-table-column label="メール" prop="email"> </el-table-column>
            <!-- <el-table-column label="状态" prop="state"></el-table-column> -->
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showStudentDetail(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteStudent(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="データなし" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5 ,10, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="学生追加" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="studentModel" label-width="100px" >
                <el-form-item label="名前" >
                    <el-input v-model="studentModel.username" placeholder="名前を入力してください"></el-input>
                </el-form-item>
                <el-form-item label="電話番号">
                    <el-input v-model="studentModel.phone" placeholder="電話番号を入力してください"></el-input>
                </el-form-item>
                <!-- <el-form-item label="文章封面">

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" 
                    action="/api/s3/upload" name="file" :headers="{'Authorization':tokenStore.token}" :on-success="uploadSuccess">
                        <img v-if="ateacherModel.coverImg" :src="teacherModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item> -->
                <el-form-item label="メール">
                    <el-input v-model="studentModel.email" placeholder="メールを入力してください"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addArticle('Released')">登録</el-button>
                    <el-button type="info" @click="addArticle('Draft')">キャンセル</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>