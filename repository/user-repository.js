const { User, Role } = require('../models/index');
const {AppError} = require('../utils/');

class UserRepository {
    async create(userData) {
        try {
            const user = await User.create({
                email: userData.email,
                password: userData.password
            });
            return user;
        } catch (error) {
            console.error("Error occurred while creating user in repository layer:", error);
            throw new AppError(
                'CreateUserError',
                'Error occurred while creating user',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
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
            return user;
        } catch (error) {
            console.error("Error occurred while fetching user from userId in repository layer:", error);
            throw new AppError(
                'GetUserByIdError',
                'Error occurred while fetching user by ID',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getByEmail(email) {
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            return user;
        } catch (error) {
            console.error("Error occurred while fetching user by email in repository layer:", error);
            throw new AppError(
                'GetUserByEmailError',
                'Error occurred while fetching user by email',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async isAdmin(userId) {
        try {
            const user = await User.findByPk(userId);
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } catch (error) {
            console.error("Error occurred while checking admin status in repository layer:", error);
            throw new AppError(
                'IsAdminError',
                'Error occurred while checking admin status',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
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