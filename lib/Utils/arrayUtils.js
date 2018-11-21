module.exports = {
  fillTillLength(array, newLength, element) {
    while(array.length < newLength) {
      array.push(element);
    }
    array.length = newLength;
    return array
  }
}