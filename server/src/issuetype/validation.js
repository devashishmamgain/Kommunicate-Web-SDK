const joi = require('joi');

module.exports.createIssueType = {
	params:{
    	userName:joi.string().required(),
    	appId:joi.string().required()
  	},
	body: {
		issueName: joi.string(),
		description: joi.string(),
		createdBy: joi.number().integer(),
		customerId: joi.number().integer(),
		status: joi.string().required().valid('active', 'pending', 'deleted')
	}
}

module.exports.updateIssueType = {
	params: {
		id: joi.number().integer().required()
	}
}

module.exports.deleteIssueType = {
	body: {
		id: joi.number().integer().required()
	}
}