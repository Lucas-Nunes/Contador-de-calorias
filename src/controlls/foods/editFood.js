const con = require('../../database/db.js')
const KcalTotal = require('./CalculateCalories/KcalTotal.js')
const logger = require('./../../ErrorControll/logger.js')

module.exports = {
    async UpdateFoodData(req, res, next){
        const id = req.body.id
        const barcode = req.body.barcode 
        let food = req.body

        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        if(!(barcode)) return res.send({'err':'barcode not found'})

        function SaveUpdateFoodData(food){
            con.query('SELECT * FROM foods WHERE barcode like ?',[barcode], (err, result)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when updating'})
                }
                if(result[0] === null) return res.send({'err':'error when updating'})
                else SaveEditFood(result[0])
            })

            function SaveEditFood(kcal){
                if (food.name != null && food.name !== "") food.name = req.body.name
                else delete food.name
    
                if (kcal.protein != null && kcal.protein !== "" && kcal.carbohydrate != null && kcal.carbohydrate !== "" && kcal.totalfat != null && kcal.totalfat !== ""){
                    food.kcal = KcalTotal.calculate(req.body.carbohydrate, req.body.totalfat, req.body.protein)
                }
                
                if (food.protein != null && food.protein !== "") food.protein = parseInt(req.body.protein)
                else delete food.protein
    
                if (food.carbohydrate != null && food.carbohydrate !== "") food.carbohydrate = parseInt(req.body.carbohydrate)
                else delete food.carbohydrate
    
                if (food.totalfat != null && food.totalfat !== "") food.totalfat = parseInt(req.body.totalfat)
                else delete food.totalfat
    
                if (food.brand != null && food.brand !== "") food.brand = req.body.brand
                else delete food.brand
    
                delete food.id
                
                if(typeof food.protein !== 'number' && typeof food.totalfat !== 'number' && typeof food.carbohydrate !== 'number') return res.send({'err':'input is not a number'})
                
                con.query('UPDATE foods SET ? WHERE barcode like ? AND id like ?',[food, barcode, id], (err, result)=> {
                    if(err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.send({'err':'error when updating'})
                    }
                    if(result.affectedRows === 0) return res.send({'err':'error when updating'})
                    else return res.send({'info':'updated successfully'})
                })
            }

        }
        SaveUpdateFoodData(food)
    }
    
}