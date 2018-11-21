const {getVowelsArray, getConsonantsArray} = require('./Utils/stringUtils');
const {fillTillLength} = require('./Utils/arrayUtils');
const {internationalize} = require ('./Utils/dateUtils');
const fetch = require('node-fetch');

class Calculator {
  constructor(Person) {
    this.person = Person.data;
  }

  get name() {
    let consonants = getConsonantsArray(this.person.name);
    let vowels = getVowelsArray(this.person.name);
    if(consonants.length > 3) {
      consonants = consonants.filter((char, index) => index !== 1);
    }
    return fillTillLength([...consonants, ...vowels], 3, 'x');
  }

  get lastName() {
    let consonants = getConsonantsArray(this.person.lastName);
    let vowels = getVowelsArray(this.person.lastName);
    return fillTillLength([...consonants, ...vowels], 3, 'x');
  }

  get dateOfBirth() {
    const converted = internationalize(this.person.dateOfBirth);

    let day = converted.getDate();

    if(this.gender && this.gender === 'F') {
      day += 40;
    }

    const monthCodes = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
    return [
      ...converted.getFullYear().toString().substr(2, 2),
      ...monthCodes[converted.getMonth()],
      ...(day.toLocaleString())
    ];
  }

  get placeOfBirth() {
    return new Promise( async (resolve, reject) => {
      let placeCodes = await fetch('https://jsonblob.com/api/jsonBlob/c761f0c2-ecf4-11e8-bcc5-9dc9b6e80c56')
        .then(data => data.json()).catch(error => reject(error));
      resolve(
        Reflect.has(placeCodes, this.person.placeOfBirth.toLocaleUpperCase()) 
          ? [...Reflect.get(placeCodes, this.person.placeOfBirth.toLocaleUpperCase())]
          : [..."XXX"]
      );
    });
  }

  get gender() {
    return this.person.gender;
  }

  checkDigitCalculator(codeArray) {
    const evenValues = 
      '0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25'.split(',');
    const oddValues = 
      '1,0,5,7,9,13,15,17,19,21,1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,22'.split(',');
    const digits = [...'0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ'];

    let oddSum = codeArray.reduce(
      (result, char, idx) => { 
        return idx % 2 === 0 
          ? result += Number(oddValues[digits.indexOf(char)])
          : result += 0;
      }, 0
    );

    let evenSum = codeArray.reduce(
      (result, char, idx) => { 
        return idx % 2 === 1 
          ? result += Number(evenValues[digits.indexOf(char)])
          : result += 0;
      }, 0
    );

    return [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'][(oddSum + evenSum) % 26];
  }

  static async generateFiscalCode(Person) {
    const isValid = Person.validate({...Person});

    if(isValid !== true) {
      throw isValid
    }

    const calculatorInstance = new Calculator(Person)
    const preCheckCode = [
      ...calculatorInstance.lastName,
      ...calculatorInstance.name,
      ...calculatorInstance.dateOfBirth,
      ...(await calculatorInstance.placeOfBirth)
    ].map(char => char.toLocaleUpperCase());  
    preCheckCode.push(calculatorInstance.checkDigitCalculator(preCheckCode));
    return preCheckCode.join('');
  }
}

module.exports = Calculator;