class Person {
  constructor(data) {
    this.name = data.name;
    this.lastName = data.lastName;
    this.dOfB = new Date(data.dateOfBirth);
    this.gender = data.gender;
    this.city = data.city;
  }
  get getName() {
    return this.name;
  }
  get getLastName() {
    return this.lastName;
  }
  get getGender() {
    return this.gender;
  }
  get getCity() {
    return this.city;
  }
  get dateOfBirth() {
    return {
      year: (this.dOfB.getFullYear().toString()).substr(2,2)
      , day: this.dOfB.getDate().toString()
      , month: this.dOfB.getMonth().toString()
    };
  }
}
