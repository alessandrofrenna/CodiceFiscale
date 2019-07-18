const invoker = (event) => {
  const name = document.querySelector("input[id='name'").value;
  const lastName = document.querySelector("input[id='lastName'").value;
  const dateOfBirth = document.querySelector("input[id='dateOfBirth'").value;
  const gender = document.querySelector("select#gender").value;
  const placeOfBirth = document.querySelector("input[id='placeOfBirth'").value;
  CodiceFiscale(name, lastName, dateOfBirth, placeOfBirth, gender)
    .then(printToScreen)
    .catch(setErrorToScreen);
}

const printToScreen = (code) => {
  document.querySelectorAll('input').forEach(el => el.classList.remove('is-danger'));
  document.querySelectorAll('p').forEach(el => el.classList.add('invisible'));
  document.querySelector("textarea#cfCode").textContent = code;
}

const setErrorToScreen = (errors) => {
  for(let obj of errors) {
    const keys = Object.keys(obj);
    if(keys[0]) {
      const errorParagraph= document.querySelector(`p.${keys[0]}`);
      let inputField = document.querySelector(`input[id="${keys[0]}"]`);
      if(!inputField) {
        inputField = document.querySelector(`select#${keys[0]}`);
      }
      console.log(keys[0], inputField.value);
      if(inputField.value.length <= 0){
        inputField.classList.add('is-danger');
        errorParagraph.classList.remove('invisible');
        errorParagraph.textContent = obj[keys[0]].message;
      }       
    }
  }
}

document.querySelector("button#calculate")
  .addEventListener('click', invoker);

document.querySelectorAll("input").forEach(el => {
  el.addEventListener('change', (event) => {
    el.classList.remove('is-danger');
    document.querySelector(`p.${el.id}`).classList.add('invisible');
  })
})

const element = document.querySelector("select#gender");
element.addEventListener('change', (event) => {
  document.querySelector(`p.${element.id}`).classList.add('invisible');
})