const UserController = require('../controllers/user.controller');
const CharacteristicController = require('../controllers/characteristic.controller');
const AllergenController = require('../controllers/alleregen.controller');
const SituationBean = require('../beans/situation.bean');

module.exports = function(app) {
    app.get('/situation/:token', async (req, res) => {
        const userId = await UserController.get_user_id_by_token(req.params.token)
        const userCharacteristics = await CharacteristicController.getByUserId(userId);
        const userAllergens = await AllergenController.getByUserId(userId);
        const situationBean = new SituationBean();
        userCharacteristics.forEach(userCharacteristic => {
            situationBean.characteristics.push(userCharacteristic.id)
        });
        userAllergens.forEach(userAllergen => {
            situationBean.allergens.push(userAllergen.id)
        });
        if(userId && userCharacteristics && userAllergens){
            res.status(200).json({
                ...situationBean
            });
        } else {
            res.status(500).end();
        }
    });
}
