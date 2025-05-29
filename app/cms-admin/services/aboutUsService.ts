import { AboutUsContent, defaultAboutUsContent } from '../models/aboutUs'

// In a real application, these functions would interact with a backend API
// For now, we'll use localStorage for demonstration purposes

export const fetchAboutUsContent = async (): Promise<AboutUsContent> => {
  // In a real app, this would be an API call
  // For now, we'll simulate a delay and return from localStorage
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window === 'undefined') {
        resolve(defaultAboutUsContent)
        return
      }
      
      try {
        const savedContent = localStorage.getItem('aboutUsContent')
        if (!savedContent) {
          resolve(defaultAboutUsContent)
          return
        }
        
        resolve(JSON.parse(savedContent) as AboutUsContent)
      } catch (error) {
        console.error('Error fetching content:', error)
        resolve(defaultAboutUsContent)
      }
    }, 500) // Simulate network delay
  })
}

export const updateAboutUsContent = async (content: AboutUsContent): Promise<void> => {
  // In a real app, this would be an API call
  // For now, we'll simulate a delay and save to localStorage
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof window === 'undefined') {
        reject(new Error('Cannot save in server environment'))
        return
      }
      
      try {
        localStorage.setItem('aboutUsContent', JSON.stringify(content))
        resolve()
      } catch (error) {
        console.error('Error updating content:', error)
        reject(new Error('Failed to update content'))
      }
    }, 500) // Simulate network delay
  })
}

// This function would be used to update the actual About Us page with the content
export const applyAboutUsContent = async (content: AboutUsContent): Promise<void> => {
  // In a real app, this would update the database or files that the frontend reads
  // For now, we'll just save to a different key in localStorage to simulate this
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof window === 'undefined') {
        reject(new Error('Cannot apply in server environment'))
        return
      }
      
      try {
        // Save to a different key to simulate applying to the frontend
        localStorage.setItem('liveAboutUsContent', JSON.stringify(content))
        resolve()
      } catch (error) {
        console.error('Error applying content:', error)
        reject(new Error('Failed to apply content'))
      }
    }, 800) // Simulate a longer operation
  })
}