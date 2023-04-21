const express = require('express')
const cors = require('cors')
const connectionDB = require('../database/config')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.connectDB()
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
        this.app.get('/login', (req, res)=>{
            res.send('Welcome to the Journal Trades!')
        })
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server listen on port ${this.port}`);
        })
    }
}

module.exports = Server;