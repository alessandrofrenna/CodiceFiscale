

function getUserData (inputs) {
  let data = {}
  for(let input of inputs) {
    if(input.type === 'radio') {
      if (input.checked) {
        data[input.name] = input.value;
      }
    } else {
      data[input.name] = input.value;
    }
  }
  return data;
}

let loadJson = function (method, url) {
  let request = new XMLHttpRequest();
  request.open(method, url);
  request.send();
  return request;
}

