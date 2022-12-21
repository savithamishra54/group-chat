const Express = require('express')

const router = Express.Router()

const groupController = require('../controllers/group')

const authenticator = require('../middleware/authenticator')

router.post('/creategroup',authenticator.authenticator,groupController.createGroup)

router.get('/getgroups',authenticator.authenticator,groupController.fetchgroup)

router.get('/getmembers/:id',authenticator.authenticator,groupController.getgroupmembers)

module.exports = router