const Trade = require('../models/trade')

module.exports.Controllers = {

    getTrades: async(req,res)=>{
        const trades = await Trade.find()
        res.json(trades)
    }
}