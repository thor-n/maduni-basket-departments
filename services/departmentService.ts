import axios from 'axios'
import type { Department } from '~/types/Department'

interface ApiResponse {
  data: Department[];
}

export const fetchDepartments = async (): Promise<Department[]> => {
  // Use environment-aware API base
  const apiBase = process.env.NODE_ENV === 'production' 
    ? '/api/v3' 
    : 'https://cphapp.rema1000.dk/api/v3'
  
  const apiKey = 'N6a8Vzkb9SrPGxw5WDDv7yGYGceakC9Y'

  try {
    const response = await axios.get<ApiResponse>(`${apiBase}/departments`, {
      headers: {
        'X-API-KEY': apiKey,
        // Add CORS headers
        'Access-Control-Allow-Origin': '*'
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching departments:', error)
    
    // Fallback for GitHub Pages or local development
    if (process.client) {
      try {
        const fallbackResponse = await axios.get<ApiResponse>('https://cphapp.rema1000.dk/api/v3/departments', {
          headers: {
            'X-API-KEY': apiKey,
            'Access-Control-Allow-Origin': '*'
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