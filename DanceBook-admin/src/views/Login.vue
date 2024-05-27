<script setup>
import { User,Lock } from '@element-plus/icons-vue'
import {ref} from 'vue'
import {adminUserLoginService} from '@/api/admin'
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router'
import { useTokenStore } from '@/stores/token';

const router = useRouter()
const tokenStore = useTokenStore();

const loginData = ref({
    adminUserName:"",
    adminPassword:""
})

const rules={
    adminUserName:[
        {required:true,message:"ユーザー名を入力してください",trigger:"blur"},
        {min:1,max:15,message:"ユーザー名の長さは1~15にしてください",trigger:"blur"}
    ],
    adminPassword:[
        {required:true,message:"パスワードを入力してください",trigger:"blur"},
        {min:6,max:20,message:"パスワードの長さは8~20にしてください",trigger:"blur"}
    ]
}

const login=async()=>{
    let result = await adminUserLoginService(loginData.value)
    ElMessage.success(result.msg?result.msg:"ログイン成功")
    tokenStore.setToken(result.data)
    router.push("/")
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData" :rules="rules">
                <el-form-item>
                    <h1>ログイン</h1>
                </el-form-item>
                <el-form-item prop="adminUserName">
                    <el-input :prefix-icon="User" placeholder="ユーザー名を入力してください" v-model="loginData.adminUserName"></el-input>
                </el-form-item>
                <el-form-item prop="adminPassword">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="パスワードを入力してください" v-model="loginData.adminPassword"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">ログイン</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.login-page{
    height: 100vh;
    background-color: white;

    .bg{
        background: url('@/assets/logo2.png') no-repeat 60% center/ 300px auto,url('@/assets/login_bg.jpg') no-repeat center/cover;
    }

    .form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title{
            margin: 0 auto;
        }

        .button{
            width: 100%;
        }

        .flex{
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>