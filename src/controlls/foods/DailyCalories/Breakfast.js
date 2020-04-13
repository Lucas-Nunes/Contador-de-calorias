const con = require('../../../database/db.js')
const logger = require('./../../../ErrorControll/logger.js')

module.exports = {
    async addfood(req, res, next){
        const id = req.body.id
        const barcode = req.body.barcode 
        function SaveUserBreakfastFoods(food){
            con.query('INSERT INTO breakfast SET ?', food, (err)=> {
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

        function CatchUserFoods(){
            con.query('SELECT * FROM foods WHERE id like ? AND barcode like ?',[id, barcode], (err, result) => {
                if (err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'info':'you have no registered food'})
                if(result.affectedRows === 0) return res.send({'err':'error when updating'})
                else return SaveUserBreakfastFoods(result)
            })
        }
        CatchUserFoods()
    }
}