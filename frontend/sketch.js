axios.defaults.proxy = {
  host: 'localhost',
  port: 3001
};
let pxls;

async function setup() {
  createCanvas(400, 400);
  background("lightgrey");
  pixelDensity(1)
  let d = pixelDensity();
  let numPixels = 4 * (d * width) * (d * height);

  console.log("numPixels");

  console.log(numPixels);
  // let res = await axios.get('http://localhost:3001/data');

  // // const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  // // console.log('Status Code:', res.status);
  // // console.log('Date in Response header:', headerDate);

  // // pxls = res.data;
  // // console.log("pxls");
  // // console.log(pxls);

  // .catch(err => {
  //   console.log('Error: ', err.message);
  // });

}

 let v = 0;

async function draw() {
  noLoop();
  frameRate(1);
  background("green");
  
  let res = await axios.get('http://localhost:3001/data');

  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.status);
  // console.log('Date in Response header:', headerDate);

  pxls = res.data.split(",");
  // console.log("pxls");
  // console.log(pxls);

  loadPixels();

  for (let i = 0; i < pixels.length; i += 1) {
    pixels[i] = pxls[i];
  }
  updatePixels();

  
}

function mouseDown() {
  size++;
}

function createDrawing(data) {
  // Use data to create shapes, lines, colors, etc. in p5.js
  // Example:
  for (const cell of data) {
    ellipse(cell.value.x, cell.value.y, 20);
  }
}
