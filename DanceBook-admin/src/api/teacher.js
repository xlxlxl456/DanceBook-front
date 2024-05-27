import request from '@/utils/request'

export const teacherListService=(params)=>{
    return request.get('/teacher',{params,params})
}

export const addTeacherService=(teacherData)=>{
    return request.post('/teacher/register',teacherData)
}

export const updateTeacherService=(teacherData)=>{
    return request.put('/teacher',teacherData)
}

export const deleteTeacherService=(id)=>{
    return request.delete('/teacher?id='+id)
}