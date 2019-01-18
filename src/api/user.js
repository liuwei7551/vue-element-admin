import request from '@/utils/request'

export function updateUserInfo(userInfo) {
  return request({
    url: `/api/account/user/${userInfo.userId}`,
    method: 'post',
    data: userInfo
  })
}
