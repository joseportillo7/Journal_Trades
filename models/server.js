const express = require('express')
const cors = require('cors')
const sequelize = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.connectDB()
        this.middlewares()
        this.routes()
    }

    async connectDB(){
        try {
            await sequelize.authenticate()
            console.log('Connection has been successfully');
        } catch (error) {
            console.log('Unable to connect to the database: '+error);
        }
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp'
        }))
    }

    routes(){
        this.app.use('/api/journal/user',require('../routes/users'))
        this.app.use('/api/journal/account',require('../routes/accounts'))
        this.app.use('/api/journal/operation',require('../routes/operations'))
        this.app.use('/api/journal/upload',require('../routes/upload'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`);
        })
    }
}

module.exports = Server;