/**
 * Gets a unique value from a generator method by checking for documents with the same value.
 *
 * To avoid infinite loops when a unique value cannot be found, it will bail and pass back an
 * undefined value after the specified number of attempts (default 10).
 *
 * WARNING: Because there will always be a small amount of time between checking for an
 * existing value and saving a document, race conditions can occur and it is possible that
 * another document has the 'unique' value assigned at the same time.
 *
 * Because of this, if true uniqueness is required, you should also create a unique index on
 * the database path, and handle duplicate errors thrown on save.
 *
 * @param {String} path to check for uniqueness
 * @param {Function} generator method to call to generate a new value
 * @param {Number} the maximum number of attempts (optional, defaults to 10)
 * @param {Function} callback(err, uniqueValue)
 */
function getUniqueValue (path, generator, limit, callback) {
	var model = this.model;
	var count = 0;
	var value;
	if (typeof limit === 'function') {
		callback = limit;
		limit = 10;
	}
	if (typeof limit !== 'number' || limit <= 0) {
		limit = 10;
	}
	if (Array.isArray(generator)) {
		var fn = generator[0];
		var args = generator.slice(1);
		generator = function () {
			return fn.apply(this, args);
		};
	}
	var check = function () {
		if (count++ >= limit) {
			return callback(undefined, undefined);
		}
		value = generator();
		var query = {};
		query[path] = value;
		model.countDocuments(query).then(function(matches) {
			if (matches > 0) return check();
			callback(undefined, value);
		}).catch(function(err) {
			return callback(err);
		});
	};
	check();
}

module.exports = getUniqueValue;
