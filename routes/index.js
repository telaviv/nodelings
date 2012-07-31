/*
 * GET home page.
 */
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 300;

exports.index = function(req, res){
    var env = { title: 'Nodelings' }
    env['canvasWidth'] = CANVAS_WIDTH;
    env['canvasHeight'] = CANVAS_HEIGHT;
    res.render('index', env);
};