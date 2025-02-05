<template>
  <div class="department-products-page container mx-auto px-4 py-8 max-w-6xl">
    <div class="page-header mb-6">
      <!-- Back Button -->
      <NuxtLink 
    to="/" 
    class="back-button flex items-center text-rema-red hover:text-red-700 transition duration-300"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="h-6 w-6 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
      />
    </svg>
    Tilbage til afdelinger
  </NuxtLink>
      
      <h1 class="text-2xl font-bold mb-4 text-rema-red">{{ departmentName }} Produkter</h1>
    </div>

    <div v-if="pending" class="loading flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-rema-red"></div>
    </div>
    
    <div v-else-if="displayError" class="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ displayError }}</span>
      <button 
        @click="retryFetch" 
        class="bg-rema-red text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition"
      >
        Prøv igen
      </button>
    </div>
    
    <div v-else-if="products && products.length" class="products-grid grid md:grid-cols-2 gap-8">
      <h1 class="text-xl font-semibold mb-4 text-gray-800">{{ departmentName }} Products</h1>
      
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="product-card bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      >
        <div class="product-image mb-4 h-64 overflow-hidden">
          <img 
            :src="product.images[0]?.medium || ''" 
            :alt="product.name"
            class="max-w-full h-full w-full object-cover rounded-md"
          >
        </div>
        
        <div class="product-details">
          <h2 class="text-gray-800 font-medium text-lg mb-2">{{ product.name }}</h2>
          <p class="text-gray-600 text-sm mb-3">{{ product.underline }}</p>
          
          <div class="product-labels flex items-center mb-3">
            <img 
              v-for="label in product.labels" 
              :key="label.id"
              :src="label.image"
              :alt="label.name"
              class="label-icon h-5 w-5 text-rema-red mr-3"
            >
          </div>
          
          <div class="product-price text-right">
            <span class="text-sm text-gray-600 font-semibold">{{ product.prices[0]?.price }} DKK</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-products text-center text-gray-600">
      <p>No products found for this department.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/Department'

const route = useRoute()
const departmentId = route.params.id as string

// Reactive state
const errorMessage = ref('Unable to fetch department products')

// Get runtime config
const { public: { apiBase, apiKey } } = useRuntimeConfig()

// Fetch products with improved error handling
const { 
  data: products, 
  pending, 
  error,
  refresh 
} = await useFetch(`/api/v3/departments/${departmentId}/products`, {
  // Transform to extract data
  transform: (response) => response.data,
  
  // Headers configuration
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Nuxt Department Products Fetcher',
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
    errorMessage.value = 'Failed to fetch products. Please check your network or contact support.'
  }
}

// Ensure error message is always defined
if (!errorMessage.value) {
  errorMessage.value = 'Unable to fetch department products'
}

// Get department name from the first product (if available)
const departmentName = computed(() => 
  products.value && products.value.length > 0 
    ? products.value[0].department_name 
    : 'Unknown Department'
)

import { useRouter, navigateTo } from '#app'
const router = useRouter()

// Navigation method with fallback
const goBack = () => {
  try {
    // Try to go back to previous page or home
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      // Fallback to home route if no previous history
      router.push({ path: '/' })
    }
  } catch (error) {
    console.error('Navigation error:', error)
    // Absolute fallback to home route
    navigateTo('/')
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: #e30613;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #ff1a1a;
}

.back-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.product-image {
  max-width: 100%;
  height: auto;
}

.product-labels {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.label-icon {
  width: 30px;
  height: 30px;
  margin: 0 5px;
}

.product-price {
  margin-top: 10px;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 20px;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #0056b3;
}
</style>