export const EmployeePassword = () => {
  const length = 12; // You can adjust the length of the password as needed
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let securePassword = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    securePassword += charset[randomIndex];
  }

  return securePassword;
};
