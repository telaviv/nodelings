/*
 * This page is useful for testing.
 */
exports.blank = function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end()
};