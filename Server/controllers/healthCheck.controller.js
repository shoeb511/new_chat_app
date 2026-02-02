const healthService = require("../services/healthCheck.service");

exports.healthCheck = () => {
    healthService.healthcheckservice();
}