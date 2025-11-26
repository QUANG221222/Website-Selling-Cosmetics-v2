export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE =
  'Chuỗi của bạn không khớp với định dạng Object Id!'

export const USERNAME_RULE = /^[a-zA-Z0-9_]{3,30}$/
export const USERNAME_RULE_MESSAGE =
  'Tên đăng nhập phải có độ dài 3-30 ký tự và chỉ được chứa chữ cái, số và dấu gạch dưới.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email không hợp lệ. (ví dụ: example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE =
  'Mật khẩu phải có 8-256 ký tự, bao gồm ít nhất một chữ cái in hoa, một số và một ký tự đặc biệt.'
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}
export const SECRET_KEY_RULE = /^[A-Za-z0-9+/]{43}=$/
export const SECRET_KEY_MESSAGE =
  'Khóa bí mật phải là chuỗi base64 hợp lệ có độ dài 32 byte (44 ký tự).'
