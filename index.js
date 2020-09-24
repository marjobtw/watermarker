const sizeOf = require('image-size');
const ImageDataURI = require('image-data-uri');
const mergeImages = require('merge-images');
const {
  Canvas,
  Image
} = require('canvas');

var Jimp = require('jimp');

var config = require('./config.json');

const path = require("path")
const fs = require("fs");


const directoryPath = path.join(__dirname, "images/in")
const outDirectory = path.join(__dirname, "images/out")

const watermarkFile = path.join(__dirname, "images/watermark/" + config.watermark)

var fetchedFiles = []

var opacity = config.opacity;

console.log("Getting files from: " + directoryPath)

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log("Error getting directory information.")
  } else {

    files.forEach(function (file) {
      fetchedFiles.push(file)
    })

    if (fetchedFiles.length != 0) {

      fetchedFiles.forEach(i => {

        var x, y;

        var watermark;

        var dimensions = sizeOf(directoryPath + "\\" + i);

        x = dimensions.width
        y = dimensions.height


        Jimp.read(watermarkFile, function (err, img) {
          if (err) throw err;
          img.resize(x, y).getBase64(Jimp.AUTO, function (e, img64) {
            if (e) throw e

            mergeImages([{
                src: directoryPath + "\\" + i,
                x: 0,
                y: 0
              },
              {
                src: img64,
                x: 0,
                y: 0,
                opacity: opacity
              }
            ], {
              Canvas: Canvas,
              Image: Image
            }).then(b64 => ImageDataURI.outputFile(b64, outDirectory + "\\" + i));

          });
        });

        console.log("Watermarked file: " + i)

      })
    } else {
      console.log("No files found")
    }
  }
})