import { GET_DB } from '~/configs/mongodb'
import Joi from 'joi'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  USER_ROLES,
  USERNAME_RULE,
  USERNAME_RULE_MESSAGE
} from '~/utils/validator'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME: string = 'users'
const USER_COLLECTION_SCHEMA: Joi.ObjectSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string()
    .required()
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE),
  username: Joi.string()
    .required()
    .pattern(USERNAME_RULE)
    .message(USERNAME_RULE_MESSAGE),
  fullName: Joi.string().required().min(3).max(100),
  role: Joi.string()
    .default(USER_ROLES.CUSTOMER)
    .valid(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: any): Promise<any> => {
  try {
    const validData = await USER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })
    const createdUser = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validData)

    return createdUser
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email: string): Promise<any> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ email: email })
    return result
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<any> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result
  } catch (error: any) {
    throw new Error(error)
  }
}

export const userModel = {
  findOneByEmail,
  createNew,
  findOneById
}
