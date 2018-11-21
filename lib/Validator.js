module.exports = {
  name: { 
    isValid: (value) => value && typeof value === 'string' && isNaN(parseInt(value)),
    message: "Il nome deve essere una stringa"
  },
  lastName: { 
    isValid: (value) => value && typeof value === 'string' && isNaN(parseInt(value)),
    message: "Il cognome deve essere una stringa"
  },
  dateOfBirth: { 
    isValid: (value) => value && (
      value.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
      || value.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    ),
    message: "La data di nascita deve essere nel formato DD/MM/YYYY oppure YYYY/MM/DD"
  },
  placeOfBirth: { 
    isValid: (value) => value && typeof value === 'string' && isNaN(parseInt(value)),
    message: "Il comune di nascita deve essere una stringa"
  },
  gender: {
    isValid: (value) => {
      switch(value) {
        case 'M':
        case 'F':
          return true;
        default: 
          return false;
      }
    },
    message: "Il sesso deve essere o uomo o donna"
  }
}