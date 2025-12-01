import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { GET_DB } from '~/configs/mongodb'

const objectIdValidator = (value: any, helpers: any) => {
  if (ObjectId.isValid(value)) {
    return value instanceof ObjectId ? value : new ObjectId(value)
  }
  return helpers.error('any.invalid')
}

const COLLECTION_NAME = 'chats'
const COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required(),
  userId: Joi.custom(objectIdValidator, 'ObjectId Validation').required(),
  userName: Joi.string().required(),
  messages: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        senderId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required(),
        senderName: Joi.string().required(),
        senderRole: Joi.string().valid('customer', 'admin').required(),
        message: Joi.string().required(),
        timestamp: Joi.date().timestamp('javascript').default(Date.now),
        isRead: Joi.boolean().default(false),
        isDeleted: Joi.boolean().default(false)
      })
    )
    .default([]),
  lastMessage: Joi.string().allow(null).default(null),
  lastMessageTime: Joi.date().timestamp('javascript').allow(null).default(null),
  unreadCount: Joi.number().default(0),
  status: Joi.string().valid('active', 'closed').default('active'),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

interface IMessage {
  _id: ObjectId
  senderId: ObjectId
  senderName: string
  senderRole: 'customer' | 'admin'
  message: string
  timestamp: Date | number
  isRead: boolean
  isDeleted: boolean
}

interface IChat {
  _id?: ObjectId
  roomId: string
  userId: ObjectId
  userName: string
  messages: IMessage[]
  lastMessage: string | null
  lastMessageTime: Date | number | null
  unreadCount: number
  status: 'active' | 'closed'
  createdAt: Date | number
  updatedAt: Date | number | null
}

const createChatRoom = async (data: Partial<IChat>): Promise<any> => {
  try {
    const validData = await COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })
    return await GET_DB().collection(COLLECTION_NAME).insertOne(validData)
  } catch (error: any) {
    throw new Error(error)
  }
}

const findChatByRoomId = async (roomId: string): Promise<IChat | null> => {
  try {
    return (await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ roomId })) as IChat | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findChatByUserId = async (userId: string): Promise<IChat | null> => {
  try {
    return (await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId) })) as IChat | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const addMessage = async (roomId: string, message: IMessage): Promise<any> => {
  try {
    return await GET_DB()
      .collection<IChat>(COLLECTION_NAME)
      .updateOne(
        { roomId },
        {
          $push: { messages: message },
          $set: {
            lastMessage: message.message,
            lastMessageTime: message.timestamp,
            updatedAt: Date.now()
          },
          $inc: {
            unreadCount: message.senderRole === 'customer' ? 1 : 0
          }
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

const markAsRead = async (roomId: string): Promise<any> => {
  try {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { roomId },
        {
          $set: {
            unreadCount: 0,
            'messages.$[elem].isRead': true
          }
        },
        {
          arrayFilters: [{ 'elem.isRead': false }]
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

const deleteMessage = async (
  roomId: string,
  messageId: string
): Promise<any> => {
  try {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          roomId,
          'messages._id': new ObjectId(messageId)
        },
        {
          $set: {
            'messages.$.isDeleted': true,
            'messages.$.message': 'Tin nhắn đã bị xóa',
            updatedAt: Date.now()
          }
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

const getAllActiveChats = async (): Promise<IChat[]> => {
  try {
    return (await GET_DB()
      .collection(COLLECTION_NAME)
      .find({ status: 'active' })
      .sort({ lastMessageTime: -1 })
      .toArray()) as IChat[]
  } catch (error: any) {
    throw new Error(error)
  }
}

export type { IChat, IMessage }
export const chatModel = {
  createChatRoom,
  findChatByRoomId,
  findChatByUserId,
  addMessage,
  markAsRead,
  deleteMessage,
  getAllActiveChats
}
