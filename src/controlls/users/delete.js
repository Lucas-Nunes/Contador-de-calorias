const con = require('../../database/db.js')
const logger = require('./../../ErrorControll/logger.js')

module.exports = {
    async delete(req, res, next){
        const id = req.body.id
        const token = req.cookies['x-access-token']
        if(!(id)) return res.send({'err':'The user has not been authenticated'})
    
        function CheckingTheID(id){
            con.query('SELECT * FROM users WHERE id like  ?', id, (err, result) => {
                if (err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'unregistered user'})
                else return SaveAndExclude(result[0],token)
            })
        }
        async function SaveAndExclude(user,token){
            delete user.name
            delete user.email
            delete user.password
            delete user.date
            let NowDate  = new Date()
            user.date = new Date(NowDate.getTime() + 15*60000)

            user.blacktoken = token

            con.query('INSERT INTO blacktokens SET ?', user, (err, result)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when logout'})
                }else return Exclude()
            })

            function Exclude(){
                con.query('DELETE FROM foods WHERE id like ?', user.id, (err,result)=> {
                    if(err){
                        logger.log({
                            level: 'error',
                            message: err
                        })                        
                        return res.send({'err':'error when logout'})
                    }else ExcludeBreakfast()
                }) 

                function ExcludeBreakfast(){
                    con.query('DELETE FROM breakfast WHERE id like ?', user.id, (err,result)=> {
                        if(err){
                            logger.log({
                                level: 'error',
                                message: err
                            }) 
                            return res.send({'err':'error when logout'})
                        }else ExcludeLunch()
                    })
                }
                function ExcludeLunch(){
                    con.query('DELETE FROM lunch WHERE id like ?', user.id, (err,result)=> {
                        if(err){
                            logger.log({
                                level: 'error',
                                message: err
                            }) 
                            return res.send({'err':'error when logout'})
                        }else return ExcludeDinner()
                    })
                }
    
                function ExcludeDinner(){
                    con.query('DELETE FROM dinner WHERE id like ?', user.id, (err,result)=> {
                        if(err){
                            logger.log({
                                level: 'error',
                                message: err
                            }) 
                            return res.send({'err':'error when logout'})
                        }else ExcludeUser()
                    })
                }
                        
                function ExcludeUser(){
                    con.query('DELETE FROM users WHERE id like ?', user.id, (err,result)=> {
                        if(err){
                            logger.log({
                                level: 'error',
                                message: err
                            }) 
                            return res.send({'err':'error when logout'})
                        }else return res.cookie('x-access-token', null ,{ maxAge: 1, httpOnly: true }).send({'info':'account successfully deleted'})
                    })
                }
            }
        }
        CheckingTheID(id)
    }
}