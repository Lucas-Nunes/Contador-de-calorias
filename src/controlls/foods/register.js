const con = require('../../database/db.js')
const CheckingBarCode = require('./barcode/barcodeVerification.js')
const KcalTotal = require('./CalculateCalories/KcalTotal.js')
const logger = require('./../../ErrorControll/logger.js')

module.exports = {

    async RegisterFood(req, res, next){
        const id = req.body.id
        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        if(!(req.body.barcode && req.body.protein && req.body.carbohydrate && req.body.totalfat && req.body.name && req.body.brand)){
            return res.send({'err':'mandatory fields not filled'})
        }
        function SaveTheFood(food){

            let StatusBarCode = CheckingBarCode.VerificationCode(req.body.barcode)
            if(StatusBarCode === false) return res.send({'err':'invalid barcode'})
            else food.barcode = req.body.barcode

            food.date = new Date().toLocaleString(), "yyyy-mm-dd"
            food.id = id
            food.kcal = KcalTotal.calculate(req.body.carbohydrate, req.body.totalfat, req.body.protein)
            food.carbohydrate = parseInt(req.body.carbohydrate)
            food.totalfat = parseInt(req.body.totalfat)
            food.protein = parseInt(req.body.protein)

            if(typeof food.protein !== 'number' && typeof food.totalfat !== 'number' && typeof food.carbohydrate !== 'number') return res.send({'err':'input is not a number'})
            
            con.query('INSERT INTO foods SET ?', food, (err)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when add'})
                }
                else return res.send({'info':'food successfully added'})
            })
        }

        con.query(`SELECT * FROM foods WHERE barcode like ?`, req.body.barcode, (err, result) => {
            if (err){
                logger.log({
                    level: 'error',
                    message: err
                })
                return res.status(301).send({'err':'Internal server error '})
            }
            if(result[0] !== undefined) return res.send({'err':'BarCode already registered'})
             else return SaveTheFood(req.body)
        })

    }

}

//CREATE TABLE foods (id varchar(32) NOT NULL, name varchar(50) NOT NULL, brand varchar(20) NOT NULL,barcode varchar(13) NOT NULL, kcal varchar(10) NOT NULL, protein varchar(10) NOT NULL, carbohydrate varchar(10) NOT NULL, totalfat  varchar(10) NOT NULL, date DATETIME NOT NULL);
//CREATE TABLE breakfast (id varchar(32) NOT NULL, name varchar(50) NOT NULL, brand varchar(20) NOT NULL,barcode varchar(13) NOT NULL, kcal varchar(10) NOT NULL, protein varchar(10) NOT NULL, carbohydrate varchar(10) NOT NULL, totalfat  varchar(10) NOT NULL, date DATETIME NOT NULL);