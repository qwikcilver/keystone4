var async = require('async');

module.exports = function (req, res) {
    var keystone = req.keystone;
    var counts = {};
    async.each(keystone.lists, function (list, next) {
        list.model.countDocuments().exec()
            .then(function (count) {
                counts[list.key] = count;
                next();
            })
            .catch(function (err) {
                next(err);
            });
    }, function (err) {
        if (err) return res.apiError('database error', err);
        return res.json({
            counts: counts,
        });
    });
};
