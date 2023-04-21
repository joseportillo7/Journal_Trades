const mongoose = require('mongoose')

const connectionDB = async() =>{
    try {
        await mongoose.connect(process.env.DB_CONNECTION)
        console.log('Database Online!');
    } catch (error) {
        console.log('DataBase Connection Error!');
        throw new Error(error)
    }
}

module.exports = connectionDB