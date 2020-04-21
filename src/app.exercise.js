// 💰 you're going to need these:
// import * as authClient from './utils/auth-client'
// import {AuthenticatedApp} from './authenticated-app'
// import {UnauthenticatedApp} from './unauthenticated-app'

// 🐨 create an App component that does all this stuff:
//   🐨 useState for the user

//   🐨 create a login function that calls authClient.login then sets the user
//   💰 const login = form => authClient.login(form).then(u => setUser(u))
//   🐨 create a registration function that does the same as login except for register

//   🐨 create a logout function that calls authClient.logout() and sets the user to null

//   🐨 if there's a user, then render then AuthenitcatedApp with the user and logout
//   🐨 if there's not a user, then render the UnauthenticatedApp with login and register

// 💰 export {App}
