import axios from 'axios'
import type { Department } from '~/types/Department'
import { useRuntimeConfig } from '#imports'

interface ApiResponse {
  data: Department[];
}

export const fetchDepartments = async (): Promise<Department[]> => {
  const { public: { apiBase, apiKey } } = useRuntimeConfig()
  
  try {
    const response = await axios.get<ApiResponse>(`${apiBase}/departments`, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
    return response.data.data  // Note the .data to extract the array
  } catch (error) {
    console.error('Error fetching departments:', error)
    
    // Fallback for GitHub Pages or local development
    if (process.client) {
      try {
        const fallbackResponse = await axios.get<ApiResponse>('https://cphapp.rema1000.dk/api/v3/departments', {
          headers: {
            'X-API-KEY': apiKey
          }
        })
        return fallbackResponse.data.data
      } catch (fallbackError) {
        console.error('Fallback API call failed:', fallbackError)
        return []
      }
    }
    
    throw error
  }
}