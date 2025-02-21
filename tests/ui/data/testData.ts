const randomId = Math.floor(100000 + Math.random() * 900000)

export const validUser = {
    username: "standard_user",
    password: "secret_sauce",
}

export const invalidCredentialError = 'Epic sadface: Username and password do not match any user in this service' 
export const usernameRequiredError = 'Epic sadface: Username is required'  
export const passwordRequiredError = 'Epic sadface: Password is required'
export const userLockedOutError = 'Epic sadface: Sorry, this user has been locked out.'