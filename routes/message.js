const Express = require('express')

const router = Express.Router()

const messageController = require('../controllers/message')

const authenticator = require('../middleware/authenticator')

router.post('/sendmsg/:id',authenticator.authenticator,messageController.sendmsg)

router.get('/getmessages/:id',messageController.retrievemsg)

module.exports = router;