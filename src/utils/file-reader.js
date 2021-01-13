const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(new Error(`Can't read ${path} file`));
      } else {
        resolve({ data: data.toString() });
      }
    });
  });
}

module.exports = readFile;
