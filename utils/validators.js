const Joi = require("joi");

const userValidationSchema = Joi.object({
  firstName: Joi.string().min(1).max(20).required(),
  lastName: Joi.string().min(1).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(15).required(),
});


const loginUserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})



module.exports = {
    userValidationSchema,
    loginUserValidationSchema
};
