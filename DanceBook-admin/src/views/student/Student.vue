<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import avatar from '@/assets/default.png'
import { ElMessage, ElMessageBox } from 'element-plus';
import { studentListService,addStudentService,updateStudentService,deleteStudentService } from '@/api/student';
import { useTokenStore } from '@/stores/token';

const tokenStore=useTokenStore()
const students=ref([])
const studentModel=ref({
    username:'',
    phone:'',
    email:'',
    userPic:''
})

const pageNum=ref(1)
const pageSize=ref(5)
const total=ref(10)

const visibleDrawer=ref(false)
const title=ref('')

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

const rules={
    username:[
        {required:true,message:'ユーザー名を入力してください',trigger:'blur'},
        {
            pattern:/^\S{1,15}$/,
            message:'ユーザー名の長さは1~15にしてください',
            trigger:'blur'
        }
    ],
    phone:[
        {required:true,message:'電話番号を入力してください',trigger:'blur'}
    ],
    email:[
        {required:true,message:'メールを入力してください',trigger:'blur'},
        {type:'email',message:'正しいメールアドレスを入力してください',trigger:'blur'}
    ]
}

const addStudent=async()=>{
    let result = await addStudentService(studentModel.value);
    ElMessage.success(result.msg?result.msg:'追加成功')

    visibleDrawer.value=false
    studentList()
}

const showStudentDetail=(row)=>{
    title.value='学生更新'
    visibleDrawer.value=true
    studentModel.value.id=row.id
    studentModel.value.username=row.username
    studentModel.value.phone=row.phone
    studentModel.value.email=row.email
    studentModel.value.userPic=row.userPic
}

const uploadSuccess=(result)=>{
    studentModel.value.userPic=result.data
}

const clearTeacherModelData=()=>{
    studentModel.value.username=''
    studentModel.value.phone=''
    studentModel.value.email=''
    studentModel.value.userPic=''
}

const updateStudent=async()=>{
    let result = await updateStudentService(studentModel.value)
    ElMessage.success(result.msg?result.msg:'更新成功')

    studentList()
    visibleDrawer.value = false
}

const deleteStudent=(row)=>{
    ElMessageBox.confirm(
        'こちらの学生を削除しますか？',
        '警告',
        {
            confirmButtonText:'削除',
            cancelButtonText:'キャンセル',
            type:'warning'
        }
    ).then(async()=>{
        let result = await deleteStudentService(row.id)
        ElMessage({
            type:'success',
            message:'削除成功'
        })
        studentList()
    }).catch(()=>[
        ElMessage({
            type:'info',
            message:'キャンセル'
        })
    ])
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>学生一覧</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true;title='学生追加';clearTeacherModelData()">学生追加</el-button>
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
            <el-table-column label="アバター" width="100" prop="userPic">
                <template v-slot="scope">
                    <img :src="scope.row.userPic?scope.row.userPic:avatar" width="40" height="40" class="head_pic"/>
                </template>
            </el-table-column>
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
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="studentModel" :rules="rules" label-width="100px" >
                <el-form-item label="名前" prop="username">
                    <el-input v-model="studentModel.username" placeholder="名前を入力してください"></el-input>
                </el-form-item>
                <el-form-item label="電話番号" prop="phone">
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
                <el-form-item label="メール" prop="email">
                    <el-input v-model="studentModel.email" placeholder="メールを入力してください"></el-input>
                </el-form-item>
                <el-form-item label="アバター" prop="userPic">
                    <!-- <el-input v-model="teacherModel.userPic"></el-input> -->
                    <el-upload 
                        ref="uploadRef"
                        class="avatar-uploader" 
                        :show-file-list="false"
                        :auto-upload="true"
                        action="/api/s3/upload"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                        >
                        <img v-if="studentModel.userPic" :src="studentModel.userPic" class="avatar" />
                        <img v-else :src="avatar" width="278" />
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title=='学生追加'?addStudent():updateStudent()">登録</el-button>
                    <el-button type="info" @click="visibleDrawer=false">キャンセル</el-button>
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

.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
</style>