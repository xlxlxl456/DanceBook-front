<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { adminUserInfoService } from '@/api/admin';
import useAdminUserInfoStore from '@/stores/adminUserInfo';
import { useTokenStore } from '@/stores/token';
import { useRouter } from 'vue-router';
import { ElMessage,ElMessageBox } from 'element-plus';

const tokenStore = useTokenStore()
const adminUserInfoStore = useAdminUserInfoStore()
const router =useRouter()

const getAdminUserInfo=async()=>{
    let result = await adminUserInfoService()
    adminUserInfoStore.setInfo(result.data)
}
getAdminUserInfo()

const handleCommand=(command)=>{
    if(command==='logout'){
        ElMessageBox.confirm(
            'ログアウトしますか？',
            '警告',
            {
                confirmButtonText:'ログアウト',
                cancelButtonText:'キャンセル',
                type:'warning'
            }
        ).then(async()=>{
            tokenStore.removeToken()
            adminUserInfoStore.removeInfo()

            router.push('/login')
            ElMessage({
                type:'success',
                message:'ログアウト成功'
            })
        }).catch(()=>{
            ElMessage({
                type:'info',
                message:'キャンセル'
            })
        })
    }else{
        router.push("/"+command)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="250px">
            <div class="el-aside_logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index="/student">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>学生一覧</span>
                </el-menu-item>
                <el-menu-item index="/teacher">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>教師一覧</span>
                </el-menu-item>
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>管理者</span>
                    </template>
                    <el-menu-item index="/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>管理者情報</span>
                    </el-menu-item>
                    <el-menu-item index="/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>アバター更新</span>
                    </el-menu-item>
                    <el-menu-item index="/resetpass">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>パスワード更新</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>管理者：<strong>{{ adminUserInfoStore.info.username }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown_box">
                        <el-avatar :src="adminUserInfoStore.info.userPic?adminUserInfoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">管理者情報</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">アバター更新</el-dropdown-item>
                            <el-dropdown-item command="resetpass" :icon="EditPen">パスワード更新</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">ログアウト</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>DanceBook System</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container{
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &_logo{
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu,
        .el-sub-menu{
            border-right: none;
        }
    }

    .el-header{
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown_box{
            display: flex;
            align-items: center;

            .el-icon{
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus{
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>