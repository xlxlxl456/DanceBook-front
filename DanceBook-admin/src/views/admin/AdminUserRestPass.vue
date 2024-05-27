<script setup>
import { ref } from 'vue';
import useAdminUserInfoStore from '@/stores/adminUserInfo';
import { useTokenStore } from '@/stores/token';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { updateAdminUserPassword } from '@/api/admin';

const adminUserInfoStore = useAdminUserInfoStore()
const tokenStore = useTokenStore()
const router = useRouter()

const passwordData=ref({
    oldPassword:"",
    newPassword:"",
    reNewPassword:""
})

const checkRePassword=(rules,value,callback)=>{
    if(value===""){
        callback(new Error("再入力パスワードをチェックしてください"))
    }else if(value !== passwordData.value.newPassword){
        callback(new Error("新パスワードと再入力パスワードは一致していない"))
    }else{
        callback()
    }
}

const rules={
    oldPassword:[
        {required:true,message:"Please input old password",trigger:"blur"},
        {min:5,max:16,message:"The length of password must be between 6 and 20",trigger:"blur"}
    ],
    newPassword:[
        {required:true,message:"Please input new password",trigger:"blur"},
        {min:5,max:16,message:"The length of password must be between 6 and 20",trigger:"blur"}
    ],
    reNewPassword:[
        {required:true,validator:checkRePassword,trigger:"blur"}
    ]
}

const updatePassword=async()=>{
    ElMessageBox.confirm(
        'パスワードを更新しますか?',
        '警告',
        {
            confirmButtonText: '更新',
            cancelButtonText: 'キャンセル',
            type: 'warning',
        }
    ).then(async()=>{
        let result = await updateAdminUserPassword(passwordData.value)
        ElMessage.success(result.msg?result.msg:'更新成功')

        tokenStore.removeToken()
        adminUserInfoStore.removeInfo()

        router.push("/login")

        ElMessage({
            type: 'success',
            message: 'ログアウトしました'
        })
    }).catch(()=>{
        ElMessage({
            type: 'info',
            message: 'キャンセルしました'
        })
    })
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>パスワード更新</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="passwordData" :rules="rules" label-width="100px" size="large" class="item">
                    <el-form-item label="旧パスワード" prop="oldPassword">
                        <el-input type="password" v-model="passwordData.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新パスワード" prop="newPassword">
                        <el-input type="password" v-model="passwordData.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="再入力パスワード" prop="reNewPassword">
                        <el-input type="password" v-model="passwordData.reNewPassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss">
.item .el-form-item__label{
    width: 150px !important;
    display: block;
    text-align: justify;
    text-align-last: justify;
}
</style>