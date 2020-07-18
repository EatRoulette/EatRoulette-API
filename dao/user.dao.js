'use strict';
const User = require('../models').User;
const mongoose = require('mongoose');

class UserDao {

    /**
     * @param user {User}
     * @param userId
     * @returns {Promise<User>}
     */
    static async updateUser(user, userId) {
        const newUser = await this.findById(userId)
        if(newUser){
            newUser.characteristics = user.characteristics;
            newUser.allergens = user.allergens;
            if(user.hasCompletedSituation){
                newUser.hasCompletedSituation = user.hasCompletedSituation;
            }
            await newUser.save();
            return newUser;
        }
        return null;
    }

    /**
     * @returns {Promise<User[]>}
     */
    static async getAllUsers() {
        return User.find().populate('sessions');
    }

    /**
     * @returns {Promise<User[]>}
     */
    static async find(json){
        return User.find(json).exec();
    }

    /**
     * @returns {Promise<User[]>}
     */
    static async findOne(json){
        return User.findOne(json).exec();
    }

    /**
     * @param id {string}
     * @returns {Promise<User|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)){
            return User.findOne({_id: id}).populate('sessions allergens characteristics', '-__v -restaurants -users');
        }
        else {
            return undefined;
        };

    }/**
     * @param id {string}
     * @returns {Promise<User|undefined>}
     */
    static async findSmallById(id) {
        if(mongoose.Types.ObjectId.isValid(id)){
            return User.findOne({_id: id}).populate('',
                '-__v -restaurants -users -sessions -allergens ' +
                '-characteristics - address -phone -town - email -postalCode ' +
                '-cgu -hasCompletedSituation -type');
        }
        else {
            return undefined;
        };

    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        User.deleteOne({_id: id}, (err) => {
            if (err) return false;
        });
        return true;
    }

    /**
     *
     * @param id
     * @returns {boolean}
     */
    static async isAdmin(id){
        let UserExist = await UserDao.find({$and:[{type:{$eq:"admin"}},{_id: id}]});
        return !!(Array.isArray(UserExist) && UserExist.length);
    }

    /**
     *
     * @param id {string}
     * @param updates {json}
     * @returns {Promise<void>}
     */
    static async updateById(id, updates) {
        return User.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }

}

module.exports = UserDao;
