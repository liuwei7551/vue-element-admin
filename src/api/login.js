import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    method: 'login'
  }
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/account/user/info',
    method: 'get'
  })
}

