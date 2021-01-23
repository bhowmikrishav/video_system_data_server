const { VideoData } = require("../actions/video_data")
const { User } = require("../actions/user")
const { manifest_tokenify } = require("../actions/manifest_tokenify")

module.exports = [
    {
        method: 'POST',
        url: '/my_video_list',
        schema: {
            body: {
                type: 'object',
                properties: {
                    user_token: {type:'string', maxLength:1000, minLength:8, "pattern": "^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$"},
                    limit:      {type:'number', min: 0, max:9999}
                }
            }
        },
        handler: async (request, reply) => {
            const body = request.body
            try{
                const user = User.verify(body.user_token)
                return await VideoData.list_user_videos(user.user_id, body.limit||5)
            }catch(e){
                reply.code(301)
                return {error:e.message, result:null}
            }
        }
    },
    {
        method: 'POST',
        url: '/get_manifest',
        schema: {
            body: {
                type: 'object',
                required:   ['video_id'],
                properties: {
                    video_id:   {type:'string'},
                    tokenify:   {type:'boolean'}
                }
            }
        },
        handler: async (request, reply) => {
            const body = request.body
            try{
                const manifest = await VideoData.get_video_manifest(body.video_id)
                if(manifest === null) throw Error("Invalid Video ID")
                return body.tokenify? manifest_tokenify(manifest) : manifest
            }catch(e){
                reply.code(301)
                return {error:e.message, result:null}
            }
        }
    }
]