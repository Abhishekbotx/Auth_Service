const AppError = require('./service-error');
const { StatusCodes } = require('http-status-codes');

class ValidationError extends AppError {
    constructor(error) {
        let errorName = error.name;
        let explaination = [];
        error.errors.forEach((err) => {
            explaination.push(err.message);
            console.log(err.message)
        });

        super(
            errorName,
            'Not able to validate the data sent in the request',
            explaination,
            StatusCodes.BAD_REQUEST
        );
    }
}

module.exports = ValidationError;