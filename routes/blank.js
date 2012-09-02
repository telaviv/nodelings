/*
 * This page is useful for testing.
 */
exports.blank = function(req, res){
    var env = {title: 'Blank'};
    res.render('layout', env);
};