import request from '@/utils/request'

export const studentListService=(params)=>{
    return request.get('/student',{params,params})
}

export const addStudentService=(studentData)=>{
    return request.post('/student/register',studentData)
}

export const updateStudentService=(studentData)=>{
    return request.put('/student',studentData)
}

export const deleteStudentService=(id)=>{
    return request.delete('/student?id='+id)
}