class RestaurantBean{
    id;
    name;
    type;
    address;

    constructor(id, name, types, address) {
        this.id = id;
        this.name = name;
        this.type = "";
        types.forEach((t, index) => this.type += index !== types.length -1 ? t.name + ", " : t.name)
        if(types.length > 0){
            this.type.slice(0, -2)
        }
        this.address = address;
    }
}
module.exports = RestaurantBean;
