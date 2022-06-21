# Compound Components

## 📝 Your Notes

Elaborate on your learnings here in `INSTRUCTIONS.md`

## Background

Whenever you find yourself copy/pasting stuff in your codebase, you may have the
urge to abstract that code into a reusable component. But not all reusable
components are _actually_ reusable. Lots of the time what it turns into is a
mess of props. I've seen "reusable" components with over 100 props! Those end up
being enormously difficult to use and maintain. They're also riddled with
performance problems and actual bugs.

But if we're mindful of the kinds of abstractions we create, then we can make
something that is truly easy to use and maintain, are bug free, and not so big
our users pay the download penalty.

Give my talk a watch for more on this concept:
[Simply React](https://www.youtube.com/watch?v=AiJ8tRRH0f8&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)

## Exercise

Production deploys:

- [Exercise](https://exercises-08-compound-components.bookshelf.lol/exercise)
- [Final](https://exercises-08-compound-components.bookshelf.lol/)

In this exercise, we've got a `LoginFormModal` component that's abstracted the
modal for our login and registration forms. The component itself isn't all that
complicated and only accepts a handful of props, but it's pretty inflexible and
we're going to start creating more modals throughout the application so we want
something that's a lot more flexible.

To that end, we're going to create a set of compound components for the modal,
so users can do this:

```jsx
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
```

For comparison, here's our `LoginFormModal`'s API:

```jsx
<LoginFormModal
  onSubmit={handleSubmit}
  modalTitle="Modal title"
  modalLabelText="Modal label (for screen readers)"
  submitButton={<button>Submit form</button>}
  openButton={<button>Open Modal</button>}
/>
```

It's definitely more code to use than our existing `LoginFormModal`, but it
actually is simpler and more flexible and will suit our future use cases without
getting any more complex.

For example, consider a situation where we don't want to only render a form but
want to render whatever we like. Our `Modal` supports this, but the
`LoginFormModal` would need to accept a new prop. Or what if we want the close
button to appear below the contents? We'd need a special prop called
`renderCloseBelow`. But with our `Modal`, it's obvious. You just move the
`ModalCloseButton` component to where you want it to go.

Much more flexible, and less API surface area.

So your job is to implement the `Modal` compound components and use them in
place of the `LoginFormModal` (and delete the `LoginFormModal`).

### Files

- `src/components/modal.js`
- `src/unauthenticated-app.js`

## Extra Credit

### 1. 💯 Add `callAll`

[Production deploy](https://exercises-08-compound-components.bookshelf.lol/extra-1)

The `ModalOpenButton` and `ModalCloseButton` implementations set the `onClick`
of their child button so you can open and close the modal. But what if the users
of those components want to do something when the user clicks the button (in
addition to opening/closing the modal) (for example, triggering analytics).

Your job is to make this use case work:

```jsx
<ModalOpenButton>
  <button onClick={() => console.log('opening the modal')}>Open Modal</button>
</ModalOpenButton>
```

**Files:**

- `src/components/modal.js`

### 2. 💯 Create ModalContentsBase

[Production deploy](https://exercises-08-compound-components.bookshelf.lol/extra-2)

So both of our current modals have a circle dismiss button and an `h3` for the
title that they're using and most modals in our app are going to have that same
layout. With that you might be tempted to just move that UI into the
`ModalContents` directly, but then we'll be stuck in the future where we want to
customize that UI (like not have a title or close button or if we want the close
button to look or be positioned differently).

So instead, let's rename our current `ModalContents` component to
`ModalContentsBase` and then create a _new_ `ModalContents` component that
_uses_ `ModalContentsBase` under the hood, but also renders the circle dismiss
button and the title.

When you're done people will be able to go from this:

```jsx
<ModalContents aria-label="Registration form">
  {circleDismissButton}
  <h3 css={{textAlign: 'center', fontSize: '2em'}}>Register</h3>
  <LoginForm
    onSubmit={register}
    submitButton={<Button variant="secondary">Register</Button>}
  />
</ModalContents>
```

To this:

```jsx
<ModalContents title="Register" aria-label="Registration form">
  <LoginForm
    onSubmit={register}
    submitButton={<Button variant="secondary">Register</Button>}
  />
</ModalContents>
```

**Files:**

- `src/components/modal.js`
- `src/unauthenticated-app.js`

## 🦉 Elaboration and Feedback

After the instruction, if you want to remember what you've just learned, then
fill out the elaboration and feedback form:

https://ws.kcd.im/?ws=Build%20React%20Apps&e=08%3A%20Compound%20Components&em=
