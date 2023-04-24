const fs = require('fs')
const csv = require('csv-parser');
const Trade = require('../models/trade')


const readCSV = async(filePath) => {
    
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
        results.push(data);
        })
        .on('end', () => {
            saveData(results)
        });
};

const saveData = async(arr) =>{
    try {
        arr.forEach(element =>{  
            const trade_number = element['Trade number']
            const instrument = element['Instrument']
            const strategy = element['Strategy']
            const account = element['Account']
            const market_pos = element['Market pos']
            const entry_time = element['Entry time']
            const exit_time = element['Exit time']
            const exit_name = element['Exit name']
            const profit = element['Profit']
            const trade = new Trade({trade_number,instrument,strategy,account,market_pos,entry_time,exit_time,exit_name,profit})
            trade.save()    
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = readCSV