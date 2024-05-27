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

export const updateAdminUserInfoService=(userInfoData)=>{
    return request.put('/update',userInfoData)
}