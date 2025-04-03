// Import testing-library extensions
import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.URL
window.URL.createObjectURL = jest.fn().mockReturnValue('mock-object-url')
window.URL.revokeObjectURL = jest.fn()

// Mock localStorage
const localStorageMock = (function() {
  let store = {}
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn(key => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    getAll: () => store,
    length: 0,
    key: jest.fn()
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Save original document.createElement
const originalDocumentCreateElement = document.createElement.bind(document)

// Mock document methods without recursion
document.createElement = jest.fn((tag) => {
  if (tag === 'a') {
    return {
      href: '',
      download: '',
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: {}
    }
  }
  // Call the original method for other elements
  return originalDocumentCreateElement(tag)
})

// Mock for ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock for IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Suppress console errors and warnings in tests
jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {}) 