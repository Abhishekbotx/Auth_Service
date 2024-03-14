const { User, Role } = require('../models/index');
const {ClientError,ValidationError} = require('../utils/');
const { StatusCodes } = require('http-status-codes');

class UserRepository {
    async create(userData) {
        try {
            const user = await User.create(userData);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            // console.error("Error occurred while creating user in repository layer:", error);
            console.log("Something went wrong on repository layer");
            throw error;
        }
    }

    async delete(userId) {
        try {
            await User.destroy(userId);
        } catch (error) {
            console.error("Error occurred while deleting user in repository layer:", error);
            throw new AppError(
                'DeleteUserError',
                'Error occurred while deleting user',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if(!user){
                throw new ClientError(
                    'AttributeNotFound',
                    'Invalid Email Sent In The Request',
                    'Please Check email, as there is no email associated with this email ',
                    StatusCodes.NOT_FOUND
                )
            }
            return user;
        } catch (error) {
            console.log("Something went wrong on repository layer");
            throw error;
        }
    }
  
    async getByEmail(email) {
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }});
            if(!user){
                throw new ClientError(
                    'AttributeNotFound',
                    'Invalid Email Sent In The Request',
                    'Please Check email, as there is no email associated with this email ',
                    StatusCodes.NOT_FOUND
                )
            }
            return user;
        } catch (error) {
            console.log("Something went wrong on repository layer");
            throw error;
        }
    }
    
    
    async isAdmin(userId) {
        try {
            const user = await this.getUserById(userId);
            
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } catch (error) {   
            throw new ClientError('ClientError',
                                  'User is not admin',
                                  'The sent email is not an admin',
                                  StatusCodes.NOT_FOUND)
        }
    }

    async addEmployee(data) {
        try {
            const user = await User.findOne({
                where: {
                    id: data.userId
                }
            });
            const adder = await User.findOne({
                where: {
                    id: data.adderId
                }
            });
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            const hasAdminRole = await adder.hasRole(adminRole);
            if (!hasAdminRole) {
                throw new AppError(
                    'AddEmployeeError',
                    'The user attempting to add an employee is not an admin.',
                    'User must have admin privileges to add an employee.',
                    403
                );
            }
            const role = await Role.findByPk(3);
            return await user.addRole(role);
        } catch (error) {
            console.error("Error occurred while adding an employee in repository layer:", error);
            throw error;
        }
    }

    async deleteEmployee(data) {
        try {
            const user = await User.findOne({
                where: {
                    id: data.userId
                }
            });
            const adder = await User.findOne({
                where: {
                    id: data.adderId
                }
            });
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            const hasAdminRole = await adder.hasRole(adminRole);
            if (!hasAdminRole) {
                throw new AppError(
                    'AddEmployeeError',
                    'The user attempting to add an employee is not an admin.',
                    'User must have admin privileges to add an employee.',
                    403
                );
            }
            const role = await Role.findByPk(3);
            return await user.removeRole(role);
        } catch (error) {
            console.error("Error occurred while deleting admin role from user in repository layer:", error);
            throw new AppError(
                'DeleteAdminError',
                'Error occurred while deleting admin role from user',
                error.message,
                500
            );
        }
    }
}


module.exports = UserRepository;