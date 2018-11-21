const Person = require('./Person');
const Calculator = require('./Calculator');


const CalculateFiscalNumber = async (name, lastName, dateOfBirth, placeOfBirth, gender) => {
  try {
    const code = await Calculator.generateFiscalCode(
      new Person(name, lastName, dateOfBirth, placeOfBirth, gender)
    )
    return code;
  } catch (error) {
    throw error;
  }
}

module.exports = CalculateFiscalNumber;
