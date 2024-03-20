const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services/index.js');
const { ValidationError } = require('../utils/index.js');

const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const response = await userService.createUser({
              email: req.body.email,
              password: req.body.password,
              otp:req.body.otp
        });
        return res.status(StatusCodes.CREATED).json({
            message: 'User created successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name == 'ValidationError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } 
        else if(error.name == 'ServiceError'){
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        else {
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
        const response = await userService.signIn({
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
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
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
        const response = await userService.isAdmin(req.body.id);
        return res.status(StatusCodes.OK).json({
            message: 'User is Admin',
            success: true,
            data: response
        });
    } catch (error) {
        console.error(error.explaination,error.statusCode);
        if (error.name == 'ValidationError') {
            return res.status(error.statusCode || StatusCodes.NOT_FOUND).json({
                message: error.message,
                success: false,
                errorexplaination:error.explanation,
                data: {}
            });
        } 
        else if(error.name == 'ClientError'){
            console.log('in client error')
            return res.status(error.statusCode).json({
                message: error.message ,
                success: false,
                error: error.explaination ,
                data: {}
            });
        }
        else {
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

const generateOtp=async(req,res)=>{
    try {
        const otp=userService.createOtp(req.body.email)
        return res.json({
            data:otp,
            message:"otp created successfully"
        })
    } catch (error) {
        console.log("Something went wrong in the controller");
        throw error
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

module.exports = { createUser, signin, isAuthenticated,generateOtp, isAdmin, addEmployee }