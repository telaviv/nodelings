/*
 * Returns a random integer within a range.
 *
 * Args:
 * @lower -- inclusive lower bound.
 * @upper -- inclusive upper bound.
 */
var randInt = function(lower, upper) {
    return Math.floor((Math.random() * upper) + lower)
};

exports.randInt = randInt;
