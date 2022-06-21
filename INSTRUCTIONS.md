# Testing Hooks and Components

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

The two building blocks of React applications are Hooks and Components. You can
make a custom hook out of anything that uses another hook, and you can split a
component into a million different slices as well. But that doesn't mean you
should test every single one of them. Following the advice in
[How to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test)
and
[Static vs Unit vs Integration vs E2E Testing for Frontend Apps](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests),
we want to make sure that we're focusing our efforts in the right place and not
testing at too low of a level unnecessarily (painting a wall with a tiny
paintbrush or painting the corners with a bucket of paint).

Typically, you'll get confidence that your components are working when you run
them as part of integration tests with other components. However, highly
reusable or complex components or hooks can really benefit from a solid suite of
tests dedicated to them specifically. Sometimes this means that you mock some or
all of their dependencies and other times they don't have any dependencies at
all.

You'll find that some people don't consider a test a "unit test" if it's not
mocking out all dependencies (like React hooks or other components). Honestly,
it really doesn't matter, so if you want to call these "Component Tests" and
"Hooks Tests" or even "lower level Integration Tests" that's cool with me. I
just care about getting confidence my stuff's not busted.

### Testing components

For testing components, we'll be using
[React Testing Library](https://testing-library.com/react), the de-facto
standard testing library for React and we'll use
[`@testing-library/user-event`](https://github.com/testing-library/user-event)
to help with our user interactions. We already have those packages installed in
this repository. We also have
[`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)
installed in our `package.json` (but you'll need to make sure to enable it in
the exercise).

Here's a quick example of how to test a component with React Testing Library:

```javascript
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MyComponent} from '../my-component'

test('renders click me button', () => {
  render(<MyComponent />)
  const button = screen.getByRole('button', {name: /click me/i})
  await userEvent.click(button)

  expect().toBeInTheDocument()
})
```

> NOTE: The latest version of `userEvent` returns promises for _all_ API calls,
> so you'll need to add `await` to any interaction you do.

### Testing hooks

Most of your custom hooks should be covered by testing the components that use
them. Doing this will help avoid our natural tendency to over-abstract your
custom hook to support things that your components don't actually need.

However, sometimes a custom hook is reusable (a library) or sufficiently complex
that testing it in isolation is a good idea. In that case you have two
approaches:

1. Create a test component that uses the hook in the typical way the hook would
   be used by consumers and test that component
2. `renderHook` from `@testing-library/react`

Learn more about the nuances between these approaches in
[How to test custom React hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks).

Here's an example of how you'd test a custom hook with `@testing-library/react`:

```javascript
import {renderHook, act} from '@testing-library/react'
import useCounter from '../use-counter'

test('should increment counter', () => {
  const {result} = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)
})
```

Learn more about that funny `act` function from
[Fix the "not wrapped in act(...)" warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning).

## Exercise

Production deploys:

- [Exercise](https://exercises-12-testing-hooks-and-components.bookshelf.lol/exercise)
- [Final](https://exercises-12-testing-hooks-and-components.bookshelf.lol/)

In this project, we have one reusable hook called `useAsync` and a set of
compound components for modals: `Modal`, `ModalContents`, `ModalOpenButton`. For
this exercise, you'll be adding tests for these things!

💰 One thing to keep in mind, we want to try and use our code in the same way we
expect users to use them. So when testing the modal compound components, we'll
render them all together, rather than trying to render them separately from one
another. This is totally fine:

```javascript
render(
  <Parent>
    <Child1 />
    <Child2>Hello</Child2>
  </Parent>,
)
```

💰 For the `useAsync` hook tests, you'll be asserting on the value returned by
the hook, that means you'll be using `toEqual({})` a fair amount. But how do you
assert that the `run`, `reset`, `setData`, and `setError` functions are correct?
You can't really, not without calling them (which you'll be doing throughout the
tests). But with `toEqual`, you _have_ to include all properties. You can use
[the `expect.any` asymetric matcher](https://jestjs.io/docs/en/expect#expectanyconstructor).
Here's how you can do that:

```javascript
const foo = () => {}
expect({foo}).toEqual({foo: expect.any(Function)})
```

Alternatively, you could assert using
[`.toMatchObject()`](https://jestjs.io/docs/en/expect#tomatchobjectobject) and
just ignore the functions. That would technically work as well. However, I
prefer the asymetric matcher in this case because I'm able to maintain
confidence that these functions are always included.

### Files

- `src/setupTests.js`
- `src/components/__tests__/modal.js`
- `src/utils/__tests__/use-async.js`

## Extra Credit

### 1. 💯 AHA Testing

[Production deploy](https://exercises-12-testing-hooks-and-components.bookshelf.lol/extra-1)

[AHA Programming](https://kentcdodds.com/blog/aha-programming) stands for "Avoid
Hasty Abstractions" and it suggests that you should "prefer duplication over the
wrong abstraction" and "optimize for change first."
[When applied to testing](https://kentcdodds.com/blog/aha-testing), it can
seriously improve the way the tests can be understood. You can communicate what
matters through the abstractions you write.

Every test for `hooks.js` is asserting on the return value of our hook, which
includes the following properties: `status`, `data`, `error`, `isIdle`,
`isLoading`, `isError`, `isSuccess`, `run`, `reset`, `setData`, and `setError`.

Including all of these problems is not only a bit of a pain, but also makes it
harder to determine the parts that are different between assertions which makes
it harder to understand the intent of the test. Remember, the "customer" of the
test is developers, so you want to make it as easy for them to understand as
possible so they can work out what's happening when a test fails.

Typically you can clean up tests via helper functions or "Test Object Factory"
functions. So we could create a function like this:

```javascript
function getAsyncState(overrides) {
  return {
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
    ...overrides,
  }
}
```

You can go ahead and do that, or because the object is so simple, you could
simply create that object and manually merge it in each assertion. Whatever you
choose to do, implement it in the tests and observe how much it improves the
readability of each test.

**Files:**

- `src/utils/__tests__/use-async.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=12%3A%20Testing%20Hooks%20and%20Components&em=
