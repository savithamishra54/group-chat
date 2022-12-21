const express = require('express')

const bodyParser = require('body-parser');


const app = express()

const cors =  require('cors')

app.use(cors())

app.use(bodyParser.json());

const sequelize = require('./util/database');

// Models
const User = require('./models/user')
const Message = require('./models/message')
const Group = require('./models/group')
const userGroup = require('./models/user-group')

// Routes
const userRoute = require('./routes/user')
const messageRoute = require('./routes/message')
const groupRoute = require('./routes/group')
const adminRoute = require('./routes/admin')

app.use(userRoute)
app.use(messageRoute)
app.use(groupRoute)
app.use(adminRoute)

// Association

User.hasMany(Message);
User.hasMany(userGroup);
Group.hasMany(Message);
Group.hasMany(userGroup);
userGroup.belongsTo(User);
userGroup.belongsTo(Group)
Message.belongsTo(User);
Message.belongsTo(Group);


sequelize.sync()
.then(response=>{
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})