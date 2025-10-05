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

// ===== INTERFACES =====

interface IUser {
  _id?: ObjectId
  email: string
  password: string
  username: string
  fullName: string
  role: string
  isActive: boolean
  verifyToken?: string
  phone?: string
  gender?: string
  dob?: Date
  avatar?: string
  createdAt: Date
  updatedAt: Date | null
  _destroy: boolean
}

interface ICreateUserData {
  email: string
  password: string
  username: string
  fullName: string
  role?: string
  isActive?: boolean
  verifyToken?: string
}

// interface IUpdateUserData {
//   fullName?: string
//   phone?: string
//   gender?: string
//   dob?: Date
//   avatar?: string
//   updatedAt: Date
// }

// ===== VALIDATION SCHEMA =====
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
  verifyToken: Joi.string().optional(),
  phone: Joi.string().optional().allow(null),
  gender: Joi.string().optional().allow(null),
  dob: Joi.date().optional().allow(null),
  avatar: Joi.string().optional().allow(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// =======  INVALID_UPDATE_FIELDS ======
// Fields that should not be updated directly
const INVALID_UPDATE_FIELDS: string[] = [
  '_id',
  'email',
  'username',
  'createdAt'
]

const createNew = async (data: ICreateUserData): Promise<any> => {
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

const findOneByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ email: email, _destroy: false })

    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneByUsername = async (username: string): Promise<IUser | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ username: username, _destroy: false })

    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<IUser | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false })
    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const update = async (id: string, data: Partial<IUser>): Promise<any> => {
  try {
    // Remove invalid fields from the update data
    Object.keys(data).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (data as any)[key]
      }
    })

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id), _destroy: false },
        { $set: data },
        {
          returnDocument: 'after'
        }
      )

    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

export const userModel = {
  findOneByEmail,
  createNew,
  findOneById,
  update,
  findOneByUsername
}
