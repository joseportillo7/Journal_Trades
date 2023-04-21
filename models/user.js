const { Schema, model } = require('mongoose') 

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Mandatory field']
    },
    email: {
        type: String,
        required: [true, 'Mandatory field'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Mandatory field']
    },
    state: {
        type: Boolean,
        default: true
    },
})

userSchema.methods.toJSON = function(){
    const {__v, password, ...user} = this.toObject()
    return user
}

module.exports = model('User', userSchema)