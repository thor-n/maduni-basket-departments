import axios from 'axios'
import type { Department } from '~/types/Department'

interface ApiResponse {
  data: Department[];
}

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axios.get<ApiResponse>('https://cphapp.rema1000.dk/api/v3/departments')
    return response.data.data  // Note the .data to extract the array
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw error
  }
}