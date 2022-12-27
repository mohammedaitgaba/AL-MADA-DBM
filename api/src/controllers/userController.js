const asyncHnadler = require('express-async-handler')
const { Error } = require('mongoose')
const User = require('../models/users')

const addUser = asyncHnadler(async(req,res)=>{
    const {Fname,Lname}=req.body
    const user = await User.create({
        Fname,
        Lname
    })
    if (user) {
        res.json({
            firstname:user.Fname,
            lastname:user.Lname
        })
    } else {
        throw new Error('invalid info')
    }
})
const getUser = asyncHnadler(async(req,res)=>{
    const user = User.find()
    if (user) {
        res.json({data:user})
    }else{
        res.json({message:"no data from users"})

    }
})
module.exports={
    addUser,getUser
}