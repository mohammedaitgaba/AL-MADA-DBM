const express = require('express')
const router = express.Router()
const { 
    addUser,
    getUser
} = require('../controllers/userController')

router.post('/add',addUser)
router.get('/get',getUser)


module.exports = router