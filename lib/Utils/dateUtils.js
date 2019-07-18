module.exports = {
  internationalize (date) {
    let dateObj = new Date(date);
    if(dateObj instanceof Date && !isNaN(dateObj)) {
      return dateObj;
    }
    return new Date(date.split('/').reverse().join('-'));
  }
}