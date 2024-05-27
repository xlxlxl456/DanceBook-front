<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { ref } from 'vue';
import { teacherListService,addTeacherService,updateTeacherService,deleteTeacherService } from '@/api/teacher';
import { ElMessage,ElMessageBox } from 'element-plus';

const teachers=ref([])
const visibleDrawer=ref(false)
const teacherModel=ref({
    username:'',
    phone:'',
    email:'',
    userPic:''
})
const title=ref('')

const pageNum=ref(1)
const pageSize=ref(5)
const total=ref(10)

const teacherList=async()=>{
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        // categoryId: categoryId.value ? categoryId.value : null,
        // state: state.value ? state.value : null
    }

    let result = await teacherListService(params)
    total.value = result.data.total
    teachers.value = result.data.items
}
teacherList()

const onCurrentChange=(num)=>{
    pageNum.value = num
    teacherList()
}

const onSizeChange=(num)=>{
    pageSize.value = num
    teacherList()
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

const addTeacher=async()=>{
    let result = await addTeacherService(teacherModel.value)
    ElMessage.success(result.msg?result.msg:'追加成功')

    visibleDrawer.value=false
    teacherList()
}

const showTeacherDetail=(row)=>{
    title.value = '教師更新'
    visibleDrawer.value=true
    teacherModel.value.id=row.id
    teacherModel.value.username=row.username
    teacherModel.value.phone=row.phone
    teacherModel.value.email=row.email
    teacherModel.value.userPic=row.userPic
}

const updateTeacher=async()=>{
    let result = await updateTeacherService(teacherModel.value)
    ElMessage.success(result.msg?result.msg:'更新成功')

    teacherList()
    visibleDrawer.value = false
}

const clearTeacherModelData=()=>{
    teacherModel.value.username=''
    teacherModel.value.phone=''
    teacherModel.value.email=''
    teacherModel.value.userPic=''
}

const deleteTeacher=async(row)=>{
    ElMessageBox.confirm(
        'こちらの教師を削除しますか？',
        '警告',
        {
            confirmButtonText:'削除',
            cancelButtonText:'キャンセル',
            type:'warning'
        }
    ).then(async()=>{
        let result = await deleteTeacherService(row.id)
        ElMessage({
            type:'success',
            message:'削除成功'
        })
        teacherList()
    }).catch(()=>{
        ElMessage({
            type:'info',
            message:'キャンセル'
        })
    })
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>教師一覧</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer=true;title='教師追加';clearTeacherModelData()">教師追加</el-button>
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
        <el-table :data="teachers" style="width: 100%">
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
                    <el-button :icon="Edit" circle plain type="primary" @click="showTeacherDetail(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteTeacher(row)"></el-button>
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
            <el-form :model="teacherModel" :rules="rules" label-width="100px" >
                <el-form-item label="名前" prop="username">
                    <el-input v-model="teacherModel.username" placeholder="名前を入力してください"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="password">
                    <el-input name="password" type="password" placeholder="パスワードを入力してください" v-model="teacherModel.password"></el-input>
                </el-form-item> -->
                <el-form-item label="電話番号" prop="phone">
                    <el-input v-model="teacherModel.phone" placeholder="電話番号を入力してください"></el-input>
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
                    <el-input v-model="teacherModel.email" placeholder="メールを入力してください"></el-input>
                </el-form-item>
                <el-form-item label="アバター" prop="userPic">
                    <el-input v-model="teacherModel.userPic"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title=='教師追加'?addTeacher():updateTeacher()">登録</el-button>
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
</style>