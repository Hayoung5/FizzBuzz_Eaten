import axios from 'axios'

const API_BASE_URL = 'http://44.214.236.166/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const userService = {
  createUser: async (userData) => {
    const response = await api.post('/user_info', userData)
    return response.data
  },
  registerUser: async (userData) => {
    const response = await api.post('/user_info', userData)
    return response.data
  }
}

export const photoService = {
  analyzePhoto: async (formData) => {
    const response = await api.post('/photo_analy', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export const statisticsService = {
  getStatistics: async (userId) => {
    const response = await api.get(`/statistics?user_id=${userId}`)
    return response.data
  }
}

export const reportService = {
  getReport: async (userId) => {
    const response = await api.get(`/report?user_id=${userId}`)
    return response.data
  }
}

export const mealRecoService = {
  getMealRecommendation: async (userId) => {
    const response = await api.get(`/meal_reco?user_id=${userId}`)
    return response.data
  }
}