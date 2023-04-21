const express = require('express')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.routes()
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