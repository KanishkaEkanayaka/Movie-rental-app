//middleware to check whether the given JWT contains asAdmin true or not.
module.exports = function(req, res, next){

    if(!req.user.isAdmin) return res.status(403).send('Access denied'); //403->forbidden
    next();
}