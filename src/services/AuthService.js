import axiosClient from '../helpers/axiosClient'

const AuthService = () => {
  const register = async (phoneNumber, email, password) => {
    const response = await axiosClient.postAsync('auth/signup', {
      phoneNumber,
      email,
      password,
    })
    if (response.Success) {
      var tokenData = JSON.stringify(response.data)
      localStorage.setItem('userAuth', tokenData)
    }
    return response
  }

  const login = async (email, password) => {
    const response = await axiosClient.postAsync('auth/signin', {
      email,
      password,
    })
    if (response.success) {
      var tokenData = JSON.stringify(response.data)
      localStorage.setItem('userAuth', tokenData)
    }
    return response
  }

  const logout = () => {
    localStorage.removeItem('userAuth')
  }

  return {
    register,
    login,
    logout,
  }
}

export default AuthService
