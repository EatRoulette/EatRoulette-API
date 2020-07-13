class RestaurantBean{
    id;
    name;
    type;
    address;
    city;

    constructor(id, name, types, address, city) {
        this.id = id;
        this.name = name;
        this.type = "";
        types && types.forEach((t, index) => this.type += index !== types.length -1 ? t.name + ", " : t.name)
        if(types.length > 0){
            this.type.slice(0, -2)
        }
        this.address = address;
        this.city = city;
    }
}
module.exports = RestaurantBean;
