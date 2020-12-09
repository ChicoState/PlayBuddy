const mongoose = require('mongoose');
const csvtojson = require('csvtojson')

const zipCodeSchema = new mongoose.Schema({
	zipCode: Number,
	Latitude: Number,
	Longitude: Number,
});

const ZipCode = mongoose.model('ZipCode', zipCodeSchema);

module.exports = ZipCode;

// read in initial database data if it isn't already there
dbFilled = ZipCode.find().then(outData => {
	let dbFilled = outData.length;
	if (!dbFilled) {
		csvtojson()
			.fromFile("database/data/zip_codes.csv")
			.then(csvData => {
				ZipCode
					.insertMany(csvData, (err, res) => {
						if (err) throw err;
					 console.log(`Inserted: ${res.insertedCount} rows`);
					});
			})
	}
})
