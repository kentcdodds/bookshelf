import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../use-async'

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

const defaultState = {
  data: null,
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  error: null,
  status: 'idle',
  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual(defaultState)
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    ...defaultState,
    isIdle: false,
    isLoading: true,
    status: 'pending',
  })
  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue)
    await p
  })
  expect(result.current).toEqual({
    ...defaultState,
    data: resolvedValue,
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    status: 'resolved',
  })

  act(() => result.current.reset())
  expect(result.current).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual(defaultState)
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current).toEqual({
    ...defaultState,
    isIdle: false,
    isLoading: true,
    status: 'pending',
  })
  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue)
    await p.catch(() => {
      /* ignore erorr */
    })
  })
  expect(result.current).toEqual({
    ...defaultState,
    status: 'rejected',
    isIdle: false,
    isLoading: false,
    isError: true,
    error: rejectedValue,
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  jest.spyOn(console, 'error')
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())
  let p
  act(() => {
    p = result.current.run(promise)
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
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
