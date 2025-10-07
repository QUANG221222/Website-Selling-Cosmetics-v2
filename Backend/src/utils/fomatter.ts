import { pick } from 'lodash'
export const slugify = (val: string) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}
export const pickCosmetic = (cosmetic: any): any => {
  return pick(cosmetic, [
    '_id',
    'nameCosmetic',
    'slug',
    'brand',
    'classify',
    'quantity',
    'description',
    'originalPrice',
    'discountPrice',
    'rating',
    'isNew',
    'isSaleOff',
    'image',
    'publicId',
    'createdAt',
    'updatedAt'
  ])
}
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
