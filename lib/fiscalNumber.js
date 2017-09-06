/*
 * Alessandro Frenna
 * Software to calculate the italian fiscal code
 * Refactored Alpha V2
 */

'use strict';

let FiscalNumber = function (Person) {

    this._name = {
        original: Person.getName,
    },

        this._lastName = {
            original: Person.getLastName,
        }

    this._city = Person.getCity;

    this._gender = Person.getGender;

    this._date = Person.dateOfBirth;

    this.completeCode = {};

};

FiscalNumber.prototype.stringComponents = function (string) {
    
    let array = Array.from(string.lowerTrimmed());
    let toBeFilteredAgainst = Array.from('aeiou');

    return {
        consonants: array.filter(el => !toBeFilteredAgainst.includes(el)),
        vowels: array.filter(el => toBeFilteredAgainst.includes(el))
    }

};

FiscalNumber.prototype.formatString = function (key, string) {
    
    result = this.stringComponents(string);
    for (let element in result) {
        this['_' + key][element] = result[element];
    }

};

FiscalNumber.prototype.lengthCodePatcher = function (array) {

    if (array.length >= 3) {
        array.length = 3;
    }

    while (array.length < 3) {
        array.push('x');
    }

    return array.join('');

};

FiscalNumber.prototype.getName = function () {
    
    return this._name.original;

};

FiscalNumber.prototype.nameCode = function () {

    this.formatString('name', this.getName());

    if (this._name.consonants.length > 3) {
        this._name.consonants.splice(1, 1);
    }

    this.completeCode.name = this.lengthCodePatcher([...this._name.consonants, ...this._name.vowels]);

};

FiscalNumber.prototype.getLastName = function () {
    
    return this._lastName.original;

};

FiscalNumber.prototype.lastNameCode = function () {
    
    this.formatString('lastName', this.getLastName());
    this.completeCode.lastName = this.lengthCodePatcher([...this._lastName.consonants, ...this._lastName.vowels]);

};

FiscalNumber.prototype.getGender = function () {
    return this._gender;
};

FiscalNumber.prototype.hasGender = function () {

    let gender = this.getGender();

    if (gender) {
        let should_be = ['M', 'F'];
        if (should_be.indexOf(gender) !== -1) {
            return true;
        } else {
            throw new Error("Wrong gender type, please check the Person object you passed to the FiscalNumber object! " +
                "The gender must be either M(male) or F(female)");
        }
    } else {
        return false
    }

};

FiscalNumber.prototype.dateCode = function () {

    let gender = ''
    let _day = 0;

    try {
        if (this.hasGender()) {
            gender = this.getGender();
        }

        if (gender === 'F') {
            _day = Number(this._date.day) + 40;
        } else {
            _day = this._date.day;
        }

        const month_codes = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];

        this.completeCode.date = {
            year: this._date.year,
            month: month_codes[this._date.month],
            day: _day
        };
        return;

    } catch (error) {
        console.log(error.message);
    }
};

FiscalNumber.prototype.getCity = function () {
    return this._city.toUpperCase();
};

FiscalNumber.prototype.stringifyCompleteCode = function () {
    
    return this.completeCode.lastName.concat(
        this.completeCode.name,
        this.completeCode.date.year,
        this.completeCode.date.month,
        this.completeCode.date.day,
        this.completeCode.city
    ).toUpperCase();

};

FiscalNumber.prototype.codeCity = async function () {

    const code = await loadJsonDistricts.then((result) => {
        return this.completeCode.city = result[this.getCity()];
    });
};

FiscalNumber.prototype.generatePreCodeString = async function () {

    this.nameCode();
    this.lastNameCode();
    this.dateCode()

    await this.codeCity();
    this._generated = this.stringifyCompleteCode();

};

FiscalNumber.prototype.checkDigitCode = function (code) {

    const code_array = Array.from(code);
    const even_values = '0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25'.split(',');
    const odd_values = '1,0,5,7,9,13,15,17,19,21,1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,22'.split(',');
    const digits = Array.from('0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ')

    let cin_even = [];
    let cin_odd = [];

    for (let i = 0; i < code_array.length; i++) {
        i % 2 === 0 ? cin_odd.push(code_array[i]) : cin_even.push(code_array[i]);
    }

    try {
        const even_sum = cin_even.sumAccordingIndexFromArrayAndValuesFromOther(digits, even_values);
        const odd_sum = cin_odd.sumAccordingIndexFromArrayAndValuesFromOther(digits, odd_values);
        this._generated += ((even_sum + odd_sum) % 26).convertToCode();

    } catch (error) {
        console.error(error.message);
    }

};

FiscalNumber.prototype.code = async function () {
    
    await this.generatePreCodeString()
    this.checkDigitCode(this._generated);
    delete this.completeCode;
    return this._generated;

};