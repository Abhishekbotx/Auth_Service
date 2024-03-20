const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpgenerator=require('otp-generator');
const {OTP}=require('../models/index')
const { ServiceError, ValidationError } = require('../utils/index')
const UserRepository = require('../repository/user-repository');
const { JWT_KEY } = require('../config/serverConfig');
const {AppError} = require('../utils/index');
const { StatusCodes } = require('http-status-codes');
const { where } = require('sequelize');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(data) {
        try {
            const res=await this.userRepository.getByEmail(data.email)
            console.log(data.otp)
            if(res){
                throw new ServiceError(
                    'User Already Present',
                    'User is already registed with this email, Please try different email ',
                    StatusCodes.CONFLICT)
            }
            
            const response=await OTP.findOne({
                where: { email: data.email },
                order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
                limit: 1 
            })
            console.log("the data in resposne :",response.otp)
            
            if (response.otp === 0) {
                // OTP not found for the email
                return res.status(400).json({
                  success: false,
                  message: "The OTP was not found",
                })
              } else if (data.otp !== response.otp) {
                // Invalid OTP
                return res.status(400).json({
                  success: false,
                  message: "The OTP is not valid",
                })
              }

            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            // console.log(error.name)
            if(error.name == 'SequelizeValidationError') {
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(data) {
        try {

            const user = await this.userRepository.getByEmail(data.email);

            const passwordsMatch = this.checkPassword(data.password, user.password);
            if (!passwordsMatch) {
                console.log("Password doesn't match");
                throw { error: 'Incorrect password' };
            }

            const newJWT = this.createToken(
                { email: user.email, id: user.id },
                JWT_KEY,
                { expiresIn: "1h" });
            return newJWT;
        } catch (error) {
            if(error.name==AttributeNotFound){
                throw error
            }
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if (!response) {
                throw { error: 'Invalid token' }
            }
            const user = await this.userRepository.getUserById;
            if (!user) {
                throw { error: 'No user with the corresponding token exists' };
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auth process");
            throw error;
        }
    }

    createToken(payload) {
        try {
            const result = jwt.sign(payload, JWT_KEY, { expiresIn: '1d' });
            return result;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in token validation", error);
            throw error;
        }
    }
    async createOtp(email){
        
        try {
            var otp= otpgenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })

            const result = await OTP.findOne({ 
                where:{
                    otp: otp,
                    email:email
                }
             })

            while(result){
                otp=otpgenerator.generate(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false
                })
            }

            const payload={
                email,otp
            }

            const otpBody=await OTP.create(payload)
            return otpBody
            
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compare(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }

    isAdmin(userId) {
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.error(error)
            console.log("Something went wrong in service layer");
            throw error;
        }
    }
}

module.exports = UserService;