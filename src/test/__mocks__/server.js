import {setupServer} from 'msw/node'
import {handlers} from '../server-handlers'

const server = setupServer(...handlers)

export * from 'msw'
export * from 'msw/node'
export {server}
