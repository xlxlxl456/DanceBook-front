<script setup>
import { ref } from 'vue'
import {ElMessage} from 'element-plus'
import { adminUserInfoService,updateAdminUserInfoService } from '@/api/admin';
import useAdminUserInfoStore from '@/stores/adminUserInfo';

const adminUserInfoStore = useAdminUserInfoStore()
const adminUserInfo=ref({...adminUserInfoStore.info})

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
const updateAdminUserInfo=async()=>{
    let result = await updateAdminUserInfoService(adminUserInfo.value)
    ElMessage.success(result.msg?result.msg:'更新成功')

    adminUserInfoStore.setInfo(adminUserInfo.value)
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="adminUserInfo" :rules="rules" label-width="100px" size="large" class="item-info">
                    <el-form-item label="ユーザー名" prop="username">
                        <el-input v-model="adminUserInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="電話番号" prop="phone">
                        <el-input v-model="adminUserInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="メール" prop="email">
                        <el-input v-model="adminUserInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateAdminUserInfo">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss">
.item-info .el-form-item__label{
    display: block;
    text-align: justify;
    text-align-last: justify;
}
</style>