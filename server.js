const Bigtable = require('@google-cloud/bigtable');
const express = require('express');
const app = express();
const port = 3001; // Choose a different port than your frontend server

const bigtable = new Bigtable();
const instance = bigtable.instance('billy-external');
const table = instance.table('bigtable-image-animation');
const COL_FAM = "cf";

const NUM_PIXELS = 2560000;


app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Example endpoint to fetch Bigtable data
app.get('/data', async (req, res) => {
	console.log("got a request")
	try {
  	// console.log(req);
		// let pixels = new Array(NUM_PIXELS);
		// pixels.fill(50);
		// pixels.map((i,v) => v = i % 2 ? 0 : v)
		// res.json(pixels);
    const data = await fetchData(); // Implement this function

    // res.json("hello!!!");
    res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching data');
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});


async function fetchData() {
	/* currently fetching data directly from Bigtable, how could I do this based on just the change streams
	could maybe look to subscribe in server and any changes you get are added to pixel array.

	Could have third screen which sends write events to bigtable – wherever you paint gets written to bigtable

	pixel array – make opactiy a function of time since change and -- it each iteration so it fades away 
	*/ 

	console.log("fetching data");
  const [row] = await table.row('full_pixel_data').get(); // Replace with your row key
  console.log(row)
  // console.log(row.data.cf)
  // console.log(row.data.cf.value)
  return row.data.cf.data[0].value;
}

// fetchData();

async function writeData() {
	const rowsToInsert = [];

	let pixels = [];
	for (let i = 0; i < NUM_PIXELS; i++) {
		pixels[i] = Math.floor(Math.random() * 256);
	}

console.log("pixels");
console.log(pixels.toString());

	rowsToInsert.push({
			key: "full_pixel_data",
			data: {
				'cf': {
					"data": {
						value: pixels.toString()
					}
				}
			}
		});


/*
	// for (let i = 0; i < 400*400; i++) {
	// 	let pix = {
	// 		key: (i+"").padStart(20,"0"),
	// 		data: {
	// 			'cf': {
	// 				pix: {
	// 					value: Math.floor(Math.random() * 256)+""
	// 				}
	// 			}
	// 		}
	// 	};

	// 	rowsToInsert.push(pix);
	// }

	*/
	console.log(rowsToInsert);

	console.log(`writing ${rowsToInsert.length} rows!`);
	try {
		await table.insert(rowsToInsert);
	}	catch (e) {
		console.error(e);
	}
	console.log("done!");
}

// writeData();