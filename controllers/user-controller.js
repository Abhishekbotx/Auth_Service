const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services/index.js');
const { ValidationError } = require('../utils/index.js');

const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const response = await userService.createUser({
              email: req.body.email,
              password: req.body.password
        });
        return res.status(StatusCodes.CREATED).json({
            message: 'User created successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const signin = async (req, res) => {
    try {
        const response = await userService.signin({
            email: req.body.email,
            password: req.body.password
        });
        return res.status(StatusCodes.OK).json({
            message: 'User logged in successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const response = await userService.isAuthenticated(req.body.token);
        return res.status(StatusCodes.OK).json({
            message: 'User is Authenticated Successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const isAdmin = async (req, res) => {
    try {
        const response = await userService.isAdmin(req.headers.id);
        return res.status(StatusCodes.OK).json({
            message: 'User is Admin',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const addEmployee = async (req, res) => {
    try {
        const response = await userService.addEmployees({
            adderId: req.body.adderId,
            userId: req.body.userId
        });
        console.log({ adder: req.body.adder, userId: req.body.id });
        return res.status(StatusCodes.OK).json({
            message: 'User added as employee successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

/*const deleteEmployee = async (req, res) => { // in progress
    try {
        const response = await userService.deleteEmployees({
            adderId: req.body.adderId,
            userId: req.body.userId
        });
        console.log({ adder: req.body.adder, userId: req.body.id });
        return res.status(StatusCodes.OK).json({
            message: 'User deleted as employee successfully',
            success: true,
            data: response
        })
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }

}*/

module.exports = { createUser, signin, isAuthenticated, isAdmin, addEmployee }