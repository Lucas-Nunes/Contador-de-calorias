const con = require('../../../database/db.js')
const logger = require('./../../../ErrorControll/logger.js')

module.exports = {
    async TotalKcal(req, res, next){
        const id =  req.body.id

        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        async function ShowUserFoods(breakfast, lunch, dinner){
            let kcal = 0
            for(let i = 0; i < breakfast.length; i++){
                kcal = kcal + parseInt(breakfast[i].kcal)
            }

            for(let i = 0; i < lunch.length; i++){
                kcal = kcal + parseInt(lunch[i].kcal)
            }

            for(let i = 0; i < dinner.length; i++){
                kcal = kcal + parseInt(dinner[i].kcal)
            }

            res.send({"info":"Total Daily Calories: " + kcal + "Kcal"})
        }

        function CatchAllUsersFoodsByTheName(){
            con.query('SELECT * FROM breakfast WHERE id like ?',id , (err, result) => {
                if (err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'food not found'})
                else return Lunch(result)
            })

            function Lunch(breakfast){
                con.query('SELECT * FROM lunch WHERE id like ?',id , (err, result) => {
                    if (err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.send({'err':'Internal server error '})
                    }
                    if(result[0] === undefined) return res.send({'err':'food not found'})
                    else return Dinner(breakfast, result)
                })
            }

            function Dinner(breakfast, lunch){
                con.query('SELECT * FROM dinner WHERE id like ?',id , (err, result) => {
                    if (err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.send({'err':'Internal server error '})
                    }
                    if(result[0] === undefined) return res.send({'err':'food not found'})
                    else return ShowUserFoods(breakfast, lunch, result)
                })
            }
        }

        CatchAllUsersFoodsByTheName()
    }
}