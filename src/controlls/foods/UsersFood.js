const con = require('../../database/db.js')
const logger = require('./../../ErrorControll/logger.js')

module.exports = {
    async showFoods(req, res, next){
        const id =  req.body.id

        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        async function ShowUserFoods(food){
            let foods = []
            for(let i = 0; i < food.length; i++){
                delete food[i].id
                food[i].carbohydrate += "g"
                food[i].totalfat += "g"
                food[i].protein += "g"
                foods.push(food[i])
            }
            return res.send(foods)
        }

        function CatchUserFoods(){
            con.query('SELECT * FROM foods WHERE id like ?', id, (err, result) => {
                if (err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'info':'you have no registered food'})
                else return ShowUserFoods(result)
            })
        }

        CatchUserFoods()
    }
}