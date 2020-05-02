const TypeRestaurant = require('../models').TypeRestaurant;
const mongoose = require('mongoose');

class TypeRestaurantDao {

    /**
     * Save a new type
     * @param restaurant
     * @returns {Promise<*>}
     */
    static async saveTypeRestaurant(type){
        const type1 = new TypeRestaurant(type);
        const ret = await type1.save();

        return ret;
    }

    /**
     * Get all types
     * @returns {Promise<*>}
     */
    static async getAll(){
        const allTypes = await TypeRestaurant.find();

        return allTypes;
    }

    /**
     * Get the type if exist
     * @param id
     * @returns {Promise<undefined|*>}
     */
    static async getById(id){
        if(mongoose.Types.ObjectId.isValid(id)){
            const type = await TypeRestaurant.findOne({_id: id});
            return type;
        }
        else {
            return undefined;
        };
    }

    /**
     * Get type by name
     * @param name
     * @returns {Promise<undefined|*>}
     */
    static async getByName(name){
        const type = await TypeRestaurant.findOne({name: name});

        if(type) {
            return type;
        } else {
            return undefined;
        }
    }

    /**
     * Update the document by his id
     * @param id
     * @param updates
     * @returns {Promise<undefined|*>}
     */
    static async modifyById(id, updates){
        if(mongoose.Types.ObjectId.isValid(id)){
            return TypeRestaurant.findOneAndUpdate({_id: id}, updates,{
                new: true //To return model after update
            });
        } else {
            return undefined;
        }
    }

    /**
     * Delete by id
     * @param id
     * @returns {Promise<boolean>}
     */
    static async deleteById(id){
        let ret = false;

        await TypeRestaurant.deleteOne({_id: id}, (err) => {
            if (err) ret =  false;
            ret = true;
        })
        return ret;
    }

}

module.exports = TypeRestaurantDao;
