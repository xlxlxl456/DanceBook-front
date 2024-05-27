<script setup>
import { ref } from 'vue'
import {ElMessage} from 'element-plus'
import { adminUserInfoService,updateAdminUserInfoService } from '@/api/admin';

const userInfo=({
    username:'',
    phone:'',
    email:''
})

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
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="ユーザー名" prop="username">
                        <el-input v-model="userInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="電話番号" prop="phone">
                        <el-input v-model="userInfo.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="メール" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>

</style>