import request from '@/utils/request'

export const studentListService=(params)=>{
    return request.get('/student',{params,params})
}