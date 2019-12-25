import request from '@/utils/request'
const api_name='/vidservice/vod';
export default {
    getPlayAuth(vid) {
        return request({
          url: '/vidservice/vod/getPlayAuth/'+vid,
          method: 'get'
        })
      }
}