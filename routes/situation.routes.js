import {SituationBean} from "../beans";

module.exports = function(app) {
    app.get('/situation/:token', async (req, res) => {
        // todo get user by token
        const user = await UserController.getByToken(req.params.token)
        const userCharacteristics = await CharacteristicController.getByUserId();
        const userAllergens = await AllergenController.getByUserId(req.params.token);
        const situationBean = new SituationBean();
        userCharacteristics.forEach(userCharacteristic => {
            situationBean.characteristics.push(userCharacteristic.id)
        });
        userAllergens.forEach(userAllergen => {
            situationBean.allergens.push(userAllergen.id)
        });
        return situationBean;
    });
}
