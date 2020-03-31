import {composeMocks} from 'msw'
import {handlers} from './server-handlers'

window.__bookshelf_serverReady = composeMocks(...handlers).start(
  '/mockServiceWorker.js',
)
