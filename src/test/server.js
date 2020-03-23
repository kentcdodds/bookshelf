import {composeMocks} from 'msw'
import {handlers} from './server-handlers'

// Start the Service Worker
window.__bookshelf_serverReady = composeMocks(...handlers).start('/msw.js')
