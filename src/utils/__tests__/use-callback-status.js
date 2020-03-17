import React from 'react'
import {render, act} from '@testing-library/react'
import useAsync from '../use-async'

function Test({children, ...props}) {
  children(useAsync())
  return null
}

function testHook(props) {
  const returnValue = {}
  render(<Test {...props}>{val => Object.assign(returnValue, val)}</Test>)
  return returnValue
}

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

const defaultState = {
  isPending: false,
  isRejected: false,
  error: null,
  status: 'rest',
  run: expect.any(Function),
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const state = testHook()
  expect(state).toEqual(defaultState)
  let p
  act(() => {
    p = state.run(promise)
  })
  expect(state).toEqual({
    ...defaultState,
    isPending: true,
    status: 'pending',
  })
  await act(async () => {
    resolve()
    await p
  })
  expect(state).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const state = testHook()
  expect(state).toEqual(defaultState)
  let p
  act(() => {
    p = state.run(promise)
  })
  expect(state).toEqual({
    ...defaultState,
    isPending: true,
    status: 'pending',
  })
  await act(async () => {
    reject('REJECTION')
    await p.catch(() => {
      /* ignore erorr */
    })
  })
  expect(state).toEqual({
    ...defaultState,
    status: 'rejected',
    isRejected: true,
    error: 'REJECTION',
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  jest.spyOn(console, 'error')
  const {promise, resolve} = deferred()
  let run
  const {unmount} = render(<Test>{val => (run = val.run)}</Test>)
  let p
  act(() => {
    p = run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })
  const badCall = console.error.mock.calls.find(args =>
    args.some(a => a && a.includes && a.includes('unmounted')),
  )
  expect(badCall).toBe(undefined)
  console.error.mockRestore()
})

test('calling "run" without a promise results in an early error', () => {
  expect(() => testHook().run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
