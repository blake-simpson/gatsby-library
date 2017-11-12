var PDFExtract = require('pdf.js-extract').PDFExtract;
var pdfExtract = new PDFExtract();
var fs = require('fs');
var path = require('path');
var basePath = '/Users/blake/Google Drive/Books/';

fs.readdir(basePath, (error, files) => {
  console.log(files);
  files.forEach(function(file) {
    const pdfPath = path.join(basePath, file);

    pdfExtract.extract(
      pdfPath,
      {} /* options, currently nothing available*/,
      function(err, data) {
        if (err) return; //console.log(err);

        if (data.meta.info) {
          console.log('\n========');
          console.log(data.filename);
          console.log('----------');
          console.log('Title:', data.meta.info.Title || file);
          console.log('Author:', data.meta.info.Author);
          console.log('Pages:', data.pdfInfo.numPages);
          console.log('========\n');
        }
      }
    );
  });
});
