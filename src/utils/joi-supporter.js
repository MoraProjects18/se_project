function restructJoiErrorObject(error) {
  let obj = { value: error["_original"], error: {} };

  error.details.map((element) => {
    if (obj.error[element.path[0]]) {
      console.log(element);
      obj.error[element.path[0]] = `${obj.error[element.path[0]]} ${
        element.message
      }`;
    } else {
      obj.error[element.path[0]] = element.message;
    }
  });

  return obj;
}

module.exports = restructJoiErrorObject;
