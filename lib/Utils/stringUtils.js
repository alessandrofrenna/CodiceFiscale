module.exports = {
  getVowelsArray (string, orderRelation) {
    const vowels = [...string.toLocaleLowerCase()]
      .filter(char => ['a', 'e', 'i', 'o', 'u'].includes(char));
    return orderRelation && typeof orderRelation === 'function' 
      ? vowels.sort(orderRelation)
      : vowels;
  },

  getConsonantsArray (string, orderRelation) {
    const consonants = [...string.toLocaleLowerCase()]
      .filter(char => !['a', 'e', 'i', 'o', 'u'].includes(char));
    return orderRelation && typeof orderRelation === 'function' 
      ? consonants.sort(orderRelation)
      : consonants
  }
}