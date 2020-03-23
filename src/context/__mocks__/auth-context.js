import React from 'react'
import * as g from 'test/generate'

const MockAuthContext = React.createContext()
MockAuthContext.displayName = 'MockAuthContext'

const mockValue = {
  user: g.buildUser(),
  login: jest.fn().mockResolvedValue(),
  logout: jest.fn(),
  register: jest.fn().mockResolvedValue(),
}

function MockAuthProvider(props) {
  return <MockAuthContext.Provider value={mockValue} {...props} />
}

function useMockAuth() {
  const context = React.useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {MockAuthProvider as AuthProvider, useMockAuth as useAuth}
