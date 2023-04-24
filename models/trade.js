const { Schema, model } = require('mongoose') 

const tradeSchema = Schema({
    trade_number: {
        type: Number,
        required: [true, 'Mandatory field']
    },
    instrument: {
        type: String,
    },
    strategy: {
        type: String,
    },
    account: {
        type: String,
        required: [true, 'Mandatory field']
    },
    market_pos: {
        type: String,
    },
    entry_time: {
        type: String,
    },
    exit_time: {
        type: String,
    },
    exit_name: {
        type: String,
    },
    profit: {
        type: String,
    }
})

tradeSchema.methods.toJSON = function(){
    const {__v, _id, ...trade} = this.toObject()
    return trade
}

module.exports = model('Trade', tradeSchema)