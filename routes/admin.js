const Express = require('express')

const router = Express.Router()

const adminController = require('../controllers/admin')

router.post('/adduser/:id',adminController.addUser)

router.post('/removeuser/:id',adminController.removeUser)

router.post('/makeadmin/:id',adminController.makeAdmin)

router.post('/removeadmin/:id',adminController.removeAdmin)

module.exports = router


