import { models } from '~/models'

const getTotalCosmetics = async (): Promise<number> => {
  try {
    return await models.cosmeticModel.getTotalCosmetics()
  } catch (error) {
    throw error
  }
}

const getTotalUsers = async (): Promise<number> => {
  try {
    return await models.userModel.getTotalUsers()
  } catch (error) {
    throw error
  }
}

const getTotalOrders = async (): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrders()
  } catch (error) {
    throw error
  }
}

const getTotalOrdersByMonth = async (
  year: number,
  month: number
): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrdersByMonth(year, month)
  } catch (error) {
    throw error
  }
}

const getTotalOrdersSuccess = async (): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrdersSuccess()
  } catch (error) {
    throw error
  }
}

const getTotalOrdersPending = async (): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrdersPending()
  } catch (error) {
    throw error
  }
}

const getTotalOrdersCancelled = async (): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrdersCancelled()
  } catch (error) {
    throw error
  }
}

const getTotalOrdersProcessing = async (): Promise<number> => {
  try {
    return await models.orderModel.getTotalOrdersProcessing()
  } catch (error) {
    throw error
  }
}

const getRevenueByYear = async (year: number): Promise<number> => {
  try {
    return await models.orderModel.getRevenueByYear(year)
  } catch (error) {
    throw error
  }
}

const getRevenueByMonth = async (
  year: number,
  month: number
): Promise<number> => {
  try {
    return await models.orderModel.getRevenueByMonth(year, month)
  } catch (error) {
    throw error
  }
}

export const dashboardService = {
  getTotalCosmetics,
  getTotalUsers,
  getTotalOrders,
  getTotalOrdersByMonth,
  getRevenueByYear,
  getTotalOrdersPending,
  getTotalOrdersSuccess,
  getTotalOrdersCancelled,
  getTotalOrdersProcessing,
  getRevenueByMonth
}
