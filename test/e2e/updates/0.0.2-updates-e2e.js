/*
	This updates finds the e2e Member and sets its isAdmin property to false.  
	e2e will check that setting in the admin UI.  
 */
var keystone = require('../../../index.js');

module.exports = function(done) {
	var Member = keystone.list('User');
	Member.model.findOneAndUpdate({isMember: true}, {$set: {isAdmin: false}}, {new: true}).exec().then(function (member) {
		if (member) {
			//console.log("***updated member: " + JSON.stringify(member.id));
			//console.log("***member is admin: " + JSON.stringify(member.isAdmin));
		} else {
			console.error("***did not find a member");
		}
		done();
	}).catch(function (err) {
		if (err) {
			console.error("***failed to read member: "+ err);
		}
		done(err);
	});
};
