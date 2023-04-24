const express = require('express')
const cors = require('cors')
const connectionDB = require('../database/config')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.connectDB()
        this.middlewares()
        this.routes()
    }

    async connectDB(){
        await connectionDB()
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
    }

    routes(){
        this.app.use('/api/journal',require('../routes'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`);
        })
    }
}

module.exports = Server;