class UserBean{
    lastName;
    firstName;
    address;
    phone;
    town;
    email;
    postalCode;
    cgu;
    allergens;
    characteristics;
    hasCompletedSituation;

    constructor(lastName, firstName, address, phone, town, email, postalCode, cgu, hasCompletedSituation) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.address = address;
        this.phone = phone;
        this.town = town;
        this.email = email;
        this.postalCode = postalCode;
        this.cgu = cgu;
        this.hasCompletedSituation = hasCompletedSituation;
    }
}
module.exports = UserBean;
