import { setupWorker } from 'msw'// api mocking library https://www.npmjs.com/package/msw
import { handlers } from './server-handlers'// define api endpoints
import { homepage } from '../../../package.json'

const fullUrl = new URL(homepage)// retrieve defined homepage from package.json "https://bookshelf.lol/"

const server = setupWorker(...handlers)// expose endpoints publicly using msw library

server.start({// start server
  quiet: true,
  serviceWorker: {
    url: fullUrl.pathname + 'mockServiceWorker.js',
  },
})

export * from 'msw'
export { server }
