const fs = require('fs')
const csv = require('csv-parser');

const readCSV = async(filePath) => {

    return new Promise((resolve, reject) => {
        
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                resolve(results)
            })
            .on('end', () => {
                reject(new Error('Error parsing csv file'))
            })
    })
};

module.exports = readCSV