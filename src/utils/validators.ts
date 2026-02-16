// Form validation utilities

export const validatePhoneNumber = (phone: string): boolean => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validateUserId = (userId: string): boolean => {
  return userId.length >= 3;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateProductQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};
