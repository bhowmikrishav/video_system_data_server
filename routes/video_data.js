const { VideoData } = require("../actions/video_data")
const { User } = require("../actions/user")

module.exports = [
    {
        method: 'POST',
        url: '/my_video_list',
        schema:{
            body:{
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
    }
]