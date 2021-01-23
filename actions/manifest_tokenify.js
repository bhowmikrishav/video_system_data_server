const JWT = require('jsonwebtoken')
const {OBJECT_TOKEN_KEY} = require('../manifest/private.json')
/**
 * 
 * @param {string} key 
 */
function mk_public_token(object_id){
    return JWT.sign({object_id, access:'*', mime_type:'video/webm'}, OBJECT_TOKEN_KEY, {expiresIn: '1h'})
}
/**
 * @param {[{
        object_id: string,
        height: 144,
        width: number,
        start_time: number,
        end_time: number,
        byte_length: number
    }]} chunk_list
 */
function chunk_list_tokenify(chunk_list) {
    if(!chunk_list) return null
    return chunk_list.map(c=>{
        c["object_token"] = mk_public_token(c.object_id)
        return c
    })
}
/**
 * @param {{stream_manifest:{'144': {chunks: [{}]},'360': {chunks: [{}]},'720': {chunks: [{}]}}}} manifest 
 */
function manifest_tokenify(manifest) {
    if(manifest.stream_manifest["144"]){
        manifest.stream_manifest["144"].chunks = chunk_list_tokenify(manifest.stream_manifest["144"].chunks)
    }
    if(manifest.stream_manifest["360"]){
        manifest.stream_manifest["360"].chunks = chunk_list_tokenify(manifest.stream_manifest["360"].chunks)
    }
    if(manifest.stream_manifest["720"]){
        manifest.stream_manifest["720"].chunks = chunk_list_tokenify(manifest.stream_manifest["720"].chunks)
    }
    return manifest
}

module.exports = {manifest_tokenify, mk_public_token}

//unit tests
/*
console.log(manifest_tokenify(
    JSON.parse(`
    {
        "_id": "600932b1e7984934f8bd01e6",
        "title": "file_example_MOV_1920_2_2MB.mov",
        "upload_time": 1611215534556,
        "upload_id": "600932aee7984934f8bd01e5",
        "user_id": "5fd6424181605b4294e1aa71",
        "stream_manifest": {
            "144": {
                "user_id": "5fd6424181605b4294e1aa71",
                "video_id": "600932b1e7984934f8bd01e6",
                "duration": 30.04,
                "chunks": [
                    {
                        "object_id": "4f9e07d0-5bbf-11eb-8286-086053800e1c|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 0,
                        "end_time": 8.54,
                        "byte_length": 49731
                    },
                    {
                        "object_id": "4fa02ab0-5bbf-11eb-8c9e-d263366c10bc|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 8.54,
                        "end_time": 12.807,
                        "byte_length": 23197
                    },
                    {
                        "object_id": "4fa1b150-5bbf-11eb-aa60-e25fb814532c|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 12.807,
                        "end_time": 17.073,
                        "byte_length": 20571
                    },
                    {
                        "object_id": "4fa310e0-5bbf-11eb-b3e7-0e5d38e355a4|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 17.073,
                        "end_time": 21.34,
                        "byte_length": 19047
                    },
                    {
                        "object_id": "4fa44960-5bbf-11eb-95a7-e5bb902051f6|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 21.34,
                        "end_time": 25.607,
                        "byte_length": 19887
                    },
                    {
                        "object_id": "4fa5a8f0-5bbf-11eb-93dc-11f3988856fc|14781",
                        "height": 144,
                        "width": 256,
                        "start_time": 25.607,
                        "end_time": 30.04,
                        "byte_length": 24964
                    }
                ]
            },
            "360": {
                "user_id": "5fd6424181605b4294e1aa71",
                "video_id": "600932b1e7984934f8bd01e6",
                "duration": 30.04,
                "chunks": [
                    {
                        "object_id": "0b13eec0-5bc6-11eb-b42f-5179c942d18b|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 0,
                        "end_time": 8.54,
                        "byte_length": 154973
                    },
                    {
                        "object_id": "0b183480-5bc6-11eb-b20b-1fec2c4d056d|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 8.54,
                        "end_time": 12.807,
                        "byte_length": 83490
                    },
                    {
                        "object_id": "0b1a7e70-5bc6-11eb-aa5a-a9359ffc5712|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 12.807,
                        "end_time": 17.073,
                        "byte_length": 68083
                    },
                    {
                        "object_id": "0b1c5330-5bc6-11eb-b113-08bd77bf7b44|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 17.073,
                        "end_time": 21.34,
                        "byte_length": 60658
                    },
                    {
                        "object_id": "0b1e00e0-5bc6-11eb-bd02-d52aba977bd1|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 21.34,
                        "end_time": 25.607,
                        "byte_length": 60816
                    },
                    {
                        "object_id": "0b1f8780-5bc6-11eb-8b67-c9cbe83e7228|19953",
                        "height": 360,
                        "width": 640,
                        "start_time": 25.607,
                        "end_time": 30.04,
                        "byte_length": 79576
                    }
                ]
            },
            "720": {
                "user_id": "5fd6424181605b4294e1aa71",
                "video_id": "600932b1e7984934f8bd01e6",
                "duration": 30.04,
                "chunks": [
                    {
                        "object_id": "b1ba2230-5bc6-11eb-baba-81774a0e82ca|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 0,
                        "end_time": 8.54,
                        "byte_length": 426301
                    },
                    {
                        "object_id": "b1c85300-5bc6-11eb-a351-18c02fdeb9c6|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 8.54,
                        "end_time": 12.807,
                        "byte_length": 206286
                    },
                    {
                        "object_id": "b1d12ca0-5bc6-11eb-b50c-016fabd39311|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 12.807,
                        "end_time": 17.073,
                        "byte_length": 158189
                    },
                    {
                        "object_id": "b1da0640-5bc6-11eb-8d7e-f0386a15c63a|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 17.073,
                        "end_time": 21.34,
                        "byte_length": 130081
                    },
                    {
                        "object_id": "b1dcc560-5bc6-11eb-a35c-89f536e6bd39|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 21.34,
                        "end_time": 25.607,
                        "byte_length": 155903
                    },
                    {
                        "object_id": "b1df3660-5bc6-11eb-9470-2638dcaf1d6f|20364",
                        "height": 720,
                        "width": 1280,
                        "start_time": 25.607,
                        "end_time": 30.04,
                        "byte_length": 185526
                    }
                ]
            }
        }
    }
    `)
).stream_manifest[144]);
*/