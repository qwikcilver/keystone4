module.exports = function initList (req, res, next) {
	var keystone = req.keystone;
	req.list = keystone.list(req.params.list);
	if (!req.list) {
		if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
			return res.status(404).json({ error: 'invalid list path' });
		}
		req.flash('error', 'List ' + req.params.list + ' could not be found.');
		return res.redirect('/' + keystone.get('admin path'));
	}
	next();
};
