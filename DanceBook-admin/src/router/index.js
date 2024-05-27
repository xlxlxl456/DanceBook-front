import { createRouter,createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'


import AdminUserInfoVue from '@/views/admin/AdminUserInfo.vue'
import AdminUserAvatarVue from '@/views/admin/AdminUserAvatar.vue'
import AdminUserRestPassVue from "@/views/admin/AdminUserRestPass.vue";
import StudentVue from '@/views/student/Student.vue'
import TeacherVue from '@/views/teacher/Teacher.vue'

const routes = [
    {path:'/login',component: LoginVue},
    {
        path:'/',component: LayoutVue,redirect:'/student',children:[
            {path: '/info',component: AdminUserInfoVue},
            {path: '/avatar',component: AdminUserAvatarVue},
            {path: '/resetpass',component: AdminUserRestPassVue},
            {path: '/teacher',component: TeacherVue},
            {path: '/student',component: StudentVue}
        ]
    }
]


const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router
