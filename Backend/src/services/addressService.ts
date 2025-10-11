import { Request } from 'express'
import {
  models,
  IAddressCreateData,
  IAddress,
  IAddressItem,
  IAddressItemUpdateData
} from '~/models'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { pickAddress } from '~/utils/fomatter'

// ===== INTERFACES =====
interface IAddressResponse {
  _id: string
  userId: string
  addresses: Array<{
    name: string
    phone: string
    addressDetail: string
    isDefault: boolean
  }>
  createdAt: Date
  updatedAt: Date | null
}

interface IAddressItemResponse {
  name: string
  phone: string
  addressDetail: string
  isDefault: boolean
}

const createNew = async (req: Request): Promise<IAddressResponse> => {
  try {
    const { userId } = req.session.user!
    const { name, phone, addressDetail, isDefault } = req.body

    // Check if user exists
    const user = await models.userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Check if user already has addresses
    const existingAddresses = await models.addressModel.findByUserId(userId)

    const newAddressItem: IAddressItem = {
      name,
      phone,
      addressDetail,
      isDefault: existingAddresses === null ? true : isDefault || false // First address is always default
    }

    let result: IAddress
    if (existingAddresses === null) {
      // Create new address document
      const newAddressData: IAddressCreateData = {
        userId,
        addresses: [newAddressItem]
      }
      const created = await models.addressModel.createNew(newAddressData)
      result = (await models.addressModel.findOneById(
        created.insertedId.toString()
      )) as IAddress
    } else {
      if (
        existingAddresses?.addresses.some((addr: any) => addr.isDefault) &&
        newAddressItem.isDefault === true
      ) {
        await models.addressModel.unsetAllDefaultAddresses(userId)
      }
      // Add to existing addresses
      result = await models.addressModel.addAddressItem(userId, newAddressItem)
    }

    return pickAddress(result)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getByUserId = async (userId: string): Promise<IAddressItemResponse[]> => {
  try {
    const addresses = await models.addressModel.findByUserId(userId)
    return addresses ? addresses.addresses : []
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getById = async (
  addressIndex: number,
  userId: string
): Promise<IAddressItemResponse> => {
  try {
    const addressDoc = await models.addressModel.findByUserId(userId)
    if (!addressDoc) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    }

    return addressDoc.addresses[addressIndex]
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateById = async (
  addressIndex: number,
  userId: string,
  updateData: IAddressItemUpdateData
): Promise<IAddressItemResponse> => {
  try {
    const addressDoc = await models.addressModel.findByUserId(userId)
    if (!addressDoc) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    }

    // If setting this address as default, unset all other defaults first
    if (updateData.isDefault === true) {
      await models.addressModel.unsetAllDefaultAddresses(userId)
    }

    // Check if we're trying to unset the only default address
    if (updateData.isDefault === false) {
      const currentAddress = addressDoc.addresses[addressIndex]
      const otherDefaultExists = addressDoc.addresses.some(
        (addr: any, index: number) => index !== addressIndex && addr.isDefault
      )

      if (currentAddress.isDefault && !otherDefaultExists) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'At least one address must be set as default'
        )
      }
    }

    const updatedDoc = await models.addressModel.updateAddressItem(
      userId,
      addressIndex,
      updateData
    )
    return updatedDoc.addresses[addressIndex]
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const deleteById = async (
  addressIndex: number,
  userId: string
): Promise<void> => {
  try {
    const addressDoc = await models.addressModel.findByUserId(userId)
    if (!addressDoc) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    }

    await models.addressModel.removeAddressItem(userId, addressIndex)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const setDefault = async (
  addressIndex: number,
  userId: string
): Promise<IAddressItemResponse> => {
  try {
    const addressDoc = await models.addressModel.findByUserId(userId)
    if (!addressDoc) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address document not found')
    }

    if (addressIndex < 0 || addressIndex >= addressDoc.addresses.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
    }

    const updatedDoc = await models.addressModel.setDefaultAddress(
      userId,
      addressIndex
    )
    return updatedDoc.addresses[addressIndex]
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getDefault = async (
  userId: string
): Promise<IAddressItemResponse | null> => {
  try {
    const defaultAddress = await models.addressModel.findDefaultByUserId(userId)
    return defaultAddress
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ===== EXPORTS =====
export type { IAddressResponse, IAddressItemResponse }

export const addressService = {
  createNew,
  getByUserId,
  getById,
  updateById,
  deleteById,
  setDefault,
  getDefault
}
