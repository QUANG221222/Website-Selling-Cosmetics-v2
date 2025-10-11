import { GET_DB } from '~/configs/mongodb'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME: string = 'addresses'
const INVALID_UPDATE_FIELDS: string[] = ['_id', 'userId', 'createdAt']

// ===== INTERFACES =====
interface IAddressItem {
  name: string
  phone: string
  addressDetail: string
  isDefault: boolean
}

interface IAddress {
  _id?: ObjectId
  userId: ObjectId
  addresses: IAddressItem[]
  createdAt: Date
  updatedAt: Date | null
  _destroy: boolean
}

interface IAddressCreateData {
  userId: string
  addresses: IAddressItem[]
}

interface IAddressUpdateData {
  addresses?: IAddressItem[]
  updatedAt?: Date
}

interface IAddressItemUpdateData {
  name?: string
  phone?: string
  addressDetail?: string
  isDefault?: boolean
}

// ===== VALIDATION SCHEMA =====
const ADDRESS_COLLECTION_SCHEMA: Joi.ObjectSchema = Joi.object({
  userId: Joi.string().required(),
  addresses: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        phone: Joi.string()
          .trim()
          .pattern(
            /^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/
          )
          .required(),
        addressDetail: Joi.string().trim().min(10).max(500).required(),
        isDefault: Joi.boolean().default(false)
      })
    )
    .required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (data: IAddressCreateData): Promise<any> => {
  try {
    const validData = await ADDRESS_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })

    const createdAddress = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne({
        ...validData,
        userId: new ObjectId(validData.userId),
        addresses: validData.addresses.map((item: any) => ({ ...item }))
      })

    return createdAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

const unsetAllDefaultAddresses = async (userId: string): Promise<void> => {
  try {
    await GET_DB()
      .collection(COLLECTION_NAME)
      .updateMany(
        { userId: new ObjectId(userId), 'addresses.isDefault': true },
        { $set: { 'addresses.$.isDefault': false } }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

const findByUserId = async (userId: string): Promise<IAddress | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
        _destroy: false
      })

    return result as IAddress | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<IAddress | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id), _destroy: false })

    return result as IAddress | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findDefaultByUserId = async (
  userId: string
): Promise<IAddressItem | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
        _destroy: false
      })

    if (result && result.addresses) {
      const defaultAddress = result.addresses.find(
        (addr: IAddressItem) => addr.isDefault
      )
      return defaultAddress || null
    }

    return null
  } catch (error: any) {
    throw new Error(error)
  }
}

const updateById = async (
  id: string,
  updateData: IAddressUpdateData
): Promise<IAddress> => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName as keyof IAddressUpdateData]
      }
    })

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result as IAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

const updateAddressItem = async (
  userId: string,
  addressIndex: number,
  updateData: IAddressItemUpdateData
): Promise<IAddress> => {
  try {
    const addressDoc = await findByUserId(userId)
    if (!addressDoc) {
      throw new Error('Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new Error('Invalid address index')
    }

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      addressDoc.addresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false
        }
      })
    }

    // Update the specific address item
    Object.assign(addressDoc.addresses[addressIndex], updateData)

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { userId: new ObjectId(userId) },
        {
          $set: {
            addresses: addressDoc.addresses,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result as IAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

const addAddressItem = async (
  userId: string,
  addressItem: IAddressItem
): Promise<IAddress> => {
  try {
    let addressDoc = await findByUserId(userId)

    if (!addressDoc) {
      // Create new address document if it doesn't exist
      const newAddressData: IAddressCreateData = {
        userId,
        addresses: [addressItem]
      }
      const created = await createNew(newAddressData)
      return (await findOneById(created.insertedId.toString())) as IAddress
    }

    // If setting as default, remove default from other addresses
    if (addressItem.isDefault) {
      addressDoc.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Add new address item
    addressDoc.addresses.push(addressItem)

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { userId: new ObjectId(userId) },
        {
          $set: {
            addresses: addressDoc.addresses,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result as IAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

const removeAddressItem = async (
  userId: string,
  addressIndex: number
): Promise<IAddress> => {
  try {
    const addressDoc = await findByUserId(userId)
    if (!addressDoc) {
      throw new Error('Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new Error('Invalid address index')
    }

    const removedItem = addressDoc.addresses[addressIndex]
    addressDoc.addresses.splice(addressIndex, 1)

    // If removed item was default and there are remaining addresses, set the first one as default
    if (removedItem.isDefault && addressDoc.addresses.length > 0) {
      addressDoc.addresses[0].isDefault = true
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { userId: new ObjectId(userId) },
        {
          $set: {
            addresses: addressDoc.addresses,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result as IAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

const deleteById = async (id: string): Promise<void> => {
  try {
    await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            _destroy: true,
            updatedAt: new Date()
          }
        }
      )
  } catch (error: any) {
    throw new Error(error)
  }
}

const setDefaultAddress = async (
  userId: string,
  addressIndex: number
): Promise<IAddress> => {
  try {
    const addressDoc = await findByUserId(userId)
    if (!addressDoc) {
      throw new Error('Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new Error('Invalid address index')
    }

    // Remove default from all addresses and set the specified one as default
    addressDoc.addresses.forEach((addr, index) => {
      addr.isDefault = index === addressIndex
    })

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { userId: new ObjectId(userId) },
        {
          $set: {
            addresses: addressDoc.addresses,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result as IAddress
  } catch (error: any) {
    throw new Error(error)
  }
}

// ===== EXPORTS =====
export type {
  IAddress,
  IAddressCreateData,
  IAddressUpdateData,
  IAddressItem,
  IAddressItemUpdateData
}

export const addressModel = {
  createNew,
  findByUserId,
  findOneById,
  findDefaultByUserId,
  updateById,
  updateAddressItem,
  addAddressItem,
  removeAddressItem,
  deleteById,
  setDefaultAddress,
  unsetAllDefaultAddresses
}
