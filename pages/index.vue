<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-rema-red">Rema 1000 Afdelinger</h1>
    
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-rema-red"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="displayError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ displayError }}</span>
      <button 
        @click="retryFetch" 
        class="bg-rema-red text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition"
      >
        Prøv igen
      </button>
    </div>
    
    <!-- Departments Grid -->
    <div 
      v-else-if="departments && departments.length" 
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <NuxtLink 
        v-for="department in departments" 
        :key="department.id" 
        :to="`/departments/${department.id}`" 
        class="transform transition duration-300 hover:scale-105"
      >
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              {{ department.name }}
            </h2>
            <p class="text-sm text-gray-600">
              Senest opdateret: 
              <span class="font-medium">
                {{ formatDate(department.products_last_modified_at) }}
              </span>
            </p>
          </div>
          <div class="bg-rema-gray p-4 flex justify-between items-center">
            <span class="text-sm text-gray-700">Se produkter</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-rema-red" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fill-rule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </NuxtLink>
    </div>
    
    <!-- No Departments State -->
    <div v-else class="text-center bg-gray-100 p-8 rounded-lg">
      <p class="text-gray-600 text-xl">Ingen afdelinger fundet</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Department } from '~/types/Department'
import { useRouter, navigateTo } from '#app'

// Reactive error message
const errorMessage = ref('Unable to fetch departments')

// Get runtime config
const { public: { apiBase, apiKey } } = useRuntimeConfig()

// Fetch departments with improved error handling
const { 
  data: departments, 
  pending, 
  error,
  refresh 
} = await useFetch(`/api/v3/departments`, {
  // Transform to extract data
  transform: (response) => response.data,
  
  // Headers configuration
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Nuxt Departments Fetcher',
    'X-API-Key': apiKey
  },
  
  // Detailed error handling
  onRequestError({ error }) {
    console.error('Fetch request error:', error)
    errorMessage.value = `Network Error: ${error.message}`
  },
  
  // Fallback for network issues
  retry: 2,
  retryDelay: 1000,
  
  // Timeout to prevent hanging
  timeout: 10000,
  
  // Handle server errors
  onResponse({ response }) {
    if (!response.ok) {
      errorMessage.value = `Server Error: ${response.statusText}`
    }
  }
})

// Reactive error handling
const displayError = computed(() => {
  if (error.value) {
    return errorMessage.value
  }
  return null
})

// Retry mechanism with more robust error handling
const retryFetch = async () => {
  try {
    await refresh()
  } catch (fetchError) {
    console.error('Retry failed:', fetchError)
    errorMessage.value = 'Failed to fetch departments. Please check your network or contact support.'
  }
}

// Ensure error message is always defined
if (!errorMessage.value) {
  errorMessage.value = 'Unable to fetch departments'
}

// Date formatting function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('da-DK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.bg-rema-red {
  background-color: #e30613;
}

.bg-rema-gray {
  background-color: #f8f9fa;
}

.text-rema-red {
  color: #e30613;
}
</style>