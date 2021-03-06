import request from '@/utils/request'
export default {
    addVideo(video) {
        return request({
            url: '/eduservice/edu-video/addVideo',
            method: 'post',
            data: video
        })
    },
    getVideoInfo(videoId) {
        return request({
            url: '/eduservice/edu-video/' + videoId,
            method: 'get'
        })
    },
    updateVideo(video) {
        return request({
            url: '/eduservice/edu-video/updateVideo',
            method: 'post',
            data: video
        })
    },
    deleteVideo(videoId) {
        return request({
            url: '/eduservice/edu-video/' + videoId,
            method: 'delete'
        })
    },
    removeAliyunVideo(videoId) {
        return request({
            url: '/vidservice/vod/' + videoId,
            method: 'delete'
        })
    }
}