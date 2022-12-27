const mongoose = require('mongoose')
const usersSchema = mongoose.Schema({
    Fname : {
        type : String ,
        required :true, 
    },
    Lname : {
        type : String ,
        required :true, 
    },

},{
    timestamps : true
})

module.exports = mongoose.model('users',usersSchema)

