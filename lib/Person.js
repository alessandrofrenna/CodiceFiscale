const validator = require('./Validator');

class Person {
  constructor(name, lastName, dateOfBirth, placeOfBirth, gender) {
    this.name = name;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.placeOfBirth = placeOfBirth;
    this.gender = gender.toLocaleUpperCase();
  }

  get data () {
    return {...this}
  };

  validate (personData) {
    const errorArray = [];
    Object.keys(personData).forEach(key => {
      if(!validator[key].isValid(personData[key])) {
        errorArray.push({
          [key]: {
            message: validator[key].message
          }
        })
      }
    })
    if(errorArray.length === 0){
      return true;
    } else {
      return errorArray;
    }
    
  }
}

//export default { Person };
module.exports = Person;