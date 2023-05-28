const fs =  require('fs')
// const {parse} =  require('csv-parse')


fs.readdir('./data', (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});