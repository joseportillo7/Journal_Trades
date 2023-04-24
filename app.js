require('dotenv').config()
const readCSV = require('./database/upload')
const Server = require('./models/server')
const path = require('path')

const filePath = path.join(__dirname, './files/file1.csv')
readCSV(filePath)

const server = new Server()
server.listen()