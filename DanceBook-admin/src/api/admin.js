import request from '@/utils/request'

export const adminUserLoginService=(loginData)=>{
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/login',params)
}

export const adminUserInfoService=()=>{
    return request.get('/info')
}

export const updateAdminUserInfoService=(adminUserInfo)=>{
    return request.put('/update',adminUserInfo)
}

export const updateAdminUserAvatarervice=(avatarURL)=>{
    const params = new URLSearchParams()
    params.append('avatarURL',avatarURL)
    return request.patch('/updateAvatar',params)
}

export const updateAdminUserPassword=(passwordData)=>{
    return request.patch('/resetpass',passwordData)
}