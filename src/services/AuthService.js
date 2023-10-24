import axiosClient from '../helpers/axiosClient'

const register = async (phoneNumber, email, password) => {
  const response = await axiosClient.postAsync('auth/signup', {
    phoneNumber,
    email,
    password,
  })
  if (response.Success) {
    localStorage.setItem('userAuth', JSON.stringify(response.data))
  }
  return response
}

const login = async (email, password) => {
  const response = await axiosClient.postAsync('auth/signin', {
    email,
    password,
  })
  if (response.success) {
    localStorage.setItem('userAuth', JSON.stringify(response.data))
  }
  return response
}

const logout = () => {
  localStorage.removeItem('userAuth')
}

const authService = {
  register,
  login,
  logout,
}

export default authService
