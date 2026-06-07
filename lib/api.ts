export const backendUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://backend:8080';