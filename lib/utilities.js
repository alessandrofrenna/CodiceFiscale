/*
* Utilities used in this project!
*/

let loadJsonDistricts = fetch('json/districts.json').then(response => response.json())

//Function that delete withespaces from a string
//and that transform it characters in lowercase.
String.prototype.lowerTrimmed = function () {

    return this.replace(/\s/g, '').toLowerCase();

}

//Function that takes two arrays as parameters.
//The first one is the array against which we need
//to check the elements of the array upon which we 
//invoked the function. If inside the first parameter
//we have our element, we track down its index.
//In the second array passed as second parameter, we store the 
//values that must be summed between each other. We use the index
//discovered befor to take from the second paramer array
//the right value to sum!
Array.prototype.sumAccordingIndexFromArrayAndValuesFromOther = function (array, other) {

    let sum = 0;

    if (!array instanceof Array || !other instanceof Array) {
        throw new Error("The function expects two arrays as parameters; a " + typeof array +
        "and a " + typeof other + " were given");
    }

    sum = this.reduce((start, element) => {
        let index = array.indexOf(element);
        return start += Number(other[index]);
    }, 0)

    return sum;

}

//Function useful to convert a number to its correspondig code.
//It is the fundamental fucntion to convert the check digit number to
//the check digit value.
Number.prototype.convertToCode = function () {

    const possibilities = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return String(possibilities[this]);
    
}