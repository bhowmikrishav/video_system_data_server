//const mongodb = require('mongodb')
const {DB} = require('./connect_db')
const jwt = require('jsonwebtoken')
const private_manifest = require('../manifest/private.json')
const mongodb = require('mongodb')

class User extends DB{
    static create_user_tupple(username, password, name){
        return {
            username, password, name
        }
    }
    static async signup(username, password, name){
        const user_tupple = User.create_user_tupple(username, password, name)
        const user_collection = (await User.mongodb_video_system()).collection('users')
        const result = await user_collection.insertOne(user_tupple)
        return result.ops.length ? result.ops[0] : null
    }
    static async login(username, password){
        const user_collection = (await User.mongodb_video_system()).collection('users')
        const result = await user_collection.findOne({
            username
        })
        if (!result) throw Object.assign(Error("Username not found"), {code : 202})
        if (result.password != password) throw Object.assign(Error("Incorrect Password"), {code : 202})

        const user_token = jwt.sign( {username:result.username, user_id:result._id}, private_manifest.USER_TOKEN_KEY, {expiresIn:'1d'} )

        return {user_token}
    }
    static async whoami(user_token){
        const user = jwt.verify( user_token, private_manifest.USER_TOKEN_KEY )
        //console.log(user);
        const user_collection = (await User.mongodb_video_system()).collection('users')
        const result = await user_collection.findOne(
            {_id : mongodb.ObjectId(user.user_id)},
            { projection : { username: 1, name : 1, meta:1 } }
        )
        return result
    }
    static async update_user( user_token, updates){
        var _updates = {}
        if(updates.name)
            _updates['name'] = updates['name']
        const user = jwt.verify( user_token, private_manifest.USER_TOKEN_KEY )
        const user_collection = (await User.mongodb_video_system()).collection('users')
        const result = await user_collection.findOneAndUpdate(
            {_id : mongodb.ObjectId(user.user_id)},
            { $set : _updates },
            {
                returnOriginal: false,
                projection : {name:1, username:1}
            }
        )
        return result.value
    }
    /**
     * @param {string} user_token 
     * @type {function(user_token): {
            username: string,
            user_id: string,
            iat: number,
            exp: number
        }}
     */
    static verify(user_token){
        return jwt.verify(user_token, private_manifest.USER_TOKEN_KEY)
    }
}

module.exports = {User}

//unit tests
//console.log(User.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpc2hhdiIsInVzZXJfaWQiOiI1ZmQ2NDI0MTgxNjA1YjQyOTRlMWFhNzEiLCJpYXQiOjE2MTEyMzc2ODEsImV4cCI6MTYxMTMyNDA4MX0.iHka7zIOPC015oFcbt-yLu47DHUw8CU0TJ7R1bHemX0'));