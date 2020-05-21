const UserController = require('../controllers/user.controller');
const CharacteristicController = require('../controllers/characteristic.controller');
const AllergenController = require('../controllers/alleregen.controller');
const SituationBean = require('../beans/situation.bean');
const bodyParser = require('body-parser');

module.exports = function(app) {
    app.get('/situation/:token', async (req, res) => {
        const userId = await UserController.get_user_id_by_token(req.params.token)
        const user = await UserController.get_user_by_id(userId)

        const situationBean = new SituationBean();

        user.characteristics.forEach(userCharacteristic => {
            situationBean.characteristics.push(userCharacteristic.id)
        });
        user.allergens.forEach(userAllergen => {
            situationBean.allergens.push(userAllergen.id)
        });

        if(userId && user){
            res.status(200).json({
                ...situationBean
            });
        } else {
            res.status(500).end();
        }
    });
    app.post('/situation/:token', bodyParser.json(), async (req, res) => {
        const userId = await UserController.get_user_id_by_token(req.params.token)
        const userToUpdate = await UserController.get_user_by_id(userId)
        const response = req.body
        userToUpdate.characteristics = [];
        response.characteristics.forEach(characteristic => {
            CharacteristicController.getCharacteristicById(characteristic.id).then(newCharacteristic => {
                if(newCharacteristic !== -1 && characteristic.selected){
                    userToUpdate.characteristics.push(newCharacteristic)
                }
            })
        })
        userToUpdate.allergens = [];
        response.allergens.forEach(allergen => {
           AllergenController.getAllergenById(allergen.id).then(newAllergen => {
               if(newAllergen !== -1 && allergen.selected){
                   userToUpdate.allergens.push(newAllergen)
               }
           });
        })
        userToUpdate.hasCompletedSituation = true;
        const update = await UserController.update_user(userToUpdate, userId)
        if(update){
            res.status(200).json({message : 'the user has been updated'});
        } else {
            res.status(500).end();
        }
    });
}
