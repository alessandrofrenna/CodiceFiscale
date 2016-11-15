/**
 * Created by Alessandro on 27/09/2016.
 */

Array.prototype.removeSpaces = function () {
    for (let element of this) {
        if (element === ' ') {
            this.splice(this.indexOf(element), 1);
        }
    }
    return this;
};

Array.prototype.removeElements = function (elements) {
    let removed = [];
    for (let i = this.length; i--;) {
        for(let k = 0; k < elements.length ; k++){
            if (this[i] === elements[k]){
                removed.push(this.splice(i, 1));
            }
        }
    }
    removed.reverse();
    return removed;
};

Array.prototype.sumElementsValue = function (values) {
    let sum = 0;
    let digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.forEach(function (element) {
        for (let i = 0; i < digits.length; i++) {
            if(digits[i] === element) {
                sum += Number(values[i]);
            }
        }
    });

    return sum;
};

Number.prototype.reminder = function (num) {
    return this%num;
};

let FiscalNumber = function (person, callback) {
    this.displayFunction = callback;
    this.name = person.getName || '';
    this.lastName = person.getLastName || '';
    this.city = person.getCity || '';
    this.dateOfBirth = person.dateOfBirth || '';
    this.gender = person.getGender || '';
    this.fiscalNumber = {};
    this.calculateFiscalNumber();
    return this.showGeneratedCode();
};

FiscalNumber.prototype.generateCodeFromStrings = function (string) {
    let vowels = [];
    let consonants = [];
    let arrayFromString = [...string.toUpperCase()];
    vowels = arrayFromString.removeSpaces().removeElements(['A','E','I','O','U']);
    consonants = arrayFromString;
    return this.checkGeneratedCodeLength({
        vowels: vowels,
        consonants: consonants
    });
};

FiscalNumber.prototype.checkGeneratedCodeLength = function (object) {
    let finalCode = [];
    if(object.hasOwnProperty('consonants') && object.hasOwnProperty('vowels')) {
        if (object.consonants.length < 3) {
            finalCode = [...object.consonants, ...object.vowels];
            while (finalCode.length < 3) {
                finalCode.push('X')
            }
            finalCode.length = 3;
            return finalCode;
        }
        return finalCode = [...object.consonants]
    }
};

FiscalNumber.prototype.nameCode = function (name) {
    let temp = this.generateCodeFromStrings(name);
    if (temp.length > 3) {
        temp.splice(1,1);
        temp.length = 3;
    }
    return temp.join('');
};

FiscalNumber.prototype.lastNameCode = function (lastName) {
    let temp =  this.generateCodeFromStrings(lastName)
    temp.length = 3;
    return temp.join('')
};

FiscalNumber.prototype.monthCode = function (date) {
    let monthValue = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
    if (date.month && monthValue[Number(date.month)]) {
        return monthValue[Number(date.month)];
    } else {
        throw 'Error: month must specified and with a valid number (0-11)!';
    }
};

FiscalNumber.prototype.yearCode = function (date) {
    return date.year;
};

FiscalNumber.prototype.dayCode = function (date, gender) {
    let dayCode = 0;
    if (!gender || !date.day) {
        throw "Error, you missed to enter the required input. Don't know how to use the ApI? check the wiki!";
    }
    if (typeof gender !== "string" || gender.length > 1 || isNaN(date.day) || (date.day > 31 || date.day < 1)) {
        throw "Error, something went wrong! You possibly entered the wrong input type or a wrong number!";
    }
    gender.toUpperCase();

    switch(gender) {
        case 'M':
            dayCode += Number(date.day);
            break;
        case 'F':
            dayCode += 40 + Number(date.day);
            break;
        default:
            throw 'Error, gender must either be M or F!';
            break;
    }

    return dayCode.toString();
};

FiscalNumber.prototype.districtCode = function (city, districts) {
    for (let district of districts) {
        if(district.district === city) {
            return district.code;
        }
    }
};

FiscalNumber.prototype.controlInternalNumber = function (fiscalNumber) {
    fiscalNumber = fiscalNumber.split('');
    let even       = [],
        odd        = [],
        evenValues = '0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25'.split(','),
        oddValues  = '1,0,5,7,9,13,15,17,19,21,1,0,5,7,9,13,15,17,19,21,2,4,18,20,11,3,6,8,12,14,16,10,22,25,24,22'.split(','),
        evenSum    = 0,
        oddSum     = 0;
    for(let i = 0; i < fiscalNumber.length; i++){
        i%2 === 0 ? odd.push(fiscalNumber[i]) : even.push(fiscalNumber[i]);
    }
    evenSum = even.sumElementsValue(evenValues);
    oddSum  = odd.sumElementsValue(oddValues);
    let cin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return cin[(evenSum+oddSum).reminder(26)];
};

FiscalNumber.prototype.calculateFiscalNumber = function (callback) {
    let request = loadJson('GET', 'json/districts.json');
    let that = this;
    request.onload = function () {
        if (request.status === 200 && request.readyState == 4) {
            let response = JSON.parse(request.responseText);
            let temp = that.lastNameCode(that.lastName).concat(
                that.nameCode(that.name),
                that.yearCode(that.dateOfBirth),
                that.monthCode(that.dateOfBirth),
                that.dayCode(that.dateOfBirth, that.gender),
                that.districtCode(that.city, response)
            );

            that.fiscalNumber.code = temp.concat(that.controlInternalNumber(temp));
            that.displayFunction(that.fiscalNumber.code);
        }
    };
};

FiscalNumber.prototype.showGeneratedCode = function (code) {
    let result = document.querySelector('p#result').textContent = code.toString();
    return result;
}

