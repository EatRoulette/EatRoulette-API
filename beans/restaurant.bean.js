class RestaurantBean{
    id;
    name;
    type;
    address;

    constructor(id, name, types, address) {
        this.id = id;
        this.name = name;
        this.type = "";
        types.forEach(t => this.type += (t + ", "))
        if(types.length > 0){
            this.type.slice(0, -1)
        }
        this.address = address;
    }
}
module.exports = RestaurantBean;
