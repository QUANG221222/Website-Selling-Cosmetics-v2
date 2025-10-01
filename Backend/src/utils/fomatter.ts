import { pick } from 'lodash'
export const pickUser = (user: any): any => {
  return pick(user, [
    '_id',
    'email',
    'username',
    'fullName',
    'role',
    'isActive',
    'createdAt',
    'updatedAt'
  ])
}
