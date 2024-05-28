import validator from "validator";

export const checkEmpty = (
  fullName,
  userName,
  email,
  password,
  confirmPassword,
  otp
) => {
  // save true if anyone value is empty
  const flag =
    validator.isEmpty(fullName) ||
    validator.isEmpty(userName) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password) ||
    validator.isEmpty(confirmPassword) ||
    validator.isEmpty(otp);
  if (flag) {
    return false;
  } else {
    return true;
  }
};

export const checkEmail = (email) => {
  // save false if email is not valid
  const flag = (validator.isEmail(email,{
    host_whitelist:["gmail.com","hotmail.com","yahoo.com","outlook.com","icloud.com"]
  }))
  if (flag) {
    return true;
  } else {
    return false;
  }
};

export const isMatch = (password,confirmPassword)=>{
    // save true if match
    const flag = validator.equals(password, confirmPassword);
    if(flag)
        {
            return true;
        }
        else
        {
            return false;
        }

};