# Build a React App - Bookshelf

👋 hi there! My name is [Kent C. Dodds](https://kentcdodds.com) and this is the
source material for
[Build a React App](https://kentcdodds.com/workshops/build-react-apps-1)!

<div align="center">
  <h2><a href="https://epicreact.dev">EpicReact.Dev</a></h2>
  <a href="https://epicreact.dev">
    <img
      width="500"
      alt="Learn React from Start to Finish"
      src="https://kentcdodds.com/images/epicreact-promo/er-1.gif"
    />
  </a>
</div>

<hr />

[![Travis Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![GPL-3.0 License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

## Pre-Workshop Instructions/Requirements

**NOTE: This repository is used for a multi-part workshop**

In order for us to maximize our efforts during the workshop, please complete the
following things to prepare.

- 📺 only necessary if the workshop is remote via Zoom
- 👋 specific to the material for this workshop
- 3️⃣ Only needed to prepare for part 3 of this workshop
- 4️⃣ Only needed to prepare for part 4 of this workshop

- [ ] 👋 Setup the project (follow the setup instructions below) (~5 minutes)
- [ ] 📺 Install and setup [Zoom](https://zoom.us) on the computer you will be
      using (~5 minutes)
- [ ] 📺 Watch
      [Use Zoom for KCD Workshops](https://egghead.io/lessons/egghead-use-zoom-for-kcd-workshops)
      (~8 minutes).
- [ ] Watch
      [How to get the bookshelf app setup](https://www.youtube.com/watch?v=8p-0aTkoD14)
      (~18 minutes). Please do NOT skip this step.
- [ ] 👋 Watch [The Beginner's Guide to React](https://kcd.im/beginner-react)
      (available free on Egghead.io), or have the equivalent experience (147
      minutes)
- [ ] 👋 Watch my talk
      [Why React Hooks](https://www.youtube.com/watch?v=zWsZcBiwgVE&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)
      (35 minutes)
- [ ] 👋 Go through my
      [Learn React Hooks Workshop](https://kentcdodds.com/workshops/hooks), or
      have the equivalent basic experience of using hooks. You should be
      experienced with `useState`, `useEffect`, and `useRef`.
- [ ] 👋 3️⃣ Go through my
      [Advanced React Hooks Workshop](https://kentcdodds.com/workshops/advanced-react-hooks),
      or have the equivalent basic experience of using advanced hooks. You
      should be experienced with `useContext`, `useReducer`, `useMemo`, and
      `useCallback`.
- [ ] 👋 4️⃣ Go through my
      [Testing React Apps Workshop](https://kentcdodds.com/workshops/testing-react-apps),
      [TestingJavaScript.com](https://testingjavascript.com), or have the
      equivalent experience testing React components with
      [Jest](https://jestjs.io/) and
      [React Testing Library](https://testing-library.com/react).

The more prepared you are for the workshop, the better it will go for you.

## System Requirements

- [git][git] v2 or greater
- [NodeJS][node] v10 or greater
- [npm][npm] v6 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/bookshelf.git
cd bookshelf
npm run setup --silent
```

If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please [file an
issue][issue] and provide _all_ the output from the commands you ran (even if
it's a lot).

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
npm start
```

This should start up your browser. If you're familiar, this is a standard
[react-scripts](https://create-react-app.dev/) application.

You can also open the production deployment:
[bookshelf.lol](https://bookshelf.lol).

## Running the tests

```shell
npm test
```

This will start [Jest](https://jestjs.io/) in watch mode. Read the output and
play around with it. The tests are there to help you reach the final version,
however _sometimes_ you can accomplish the task and the tests still fail if you
implement things differently than I do in my solution, so don't look to them as
a complete authority.

## Working through the exercises

To get started, run:

```shell
node go
```

This will allow you to choose which exercise you want to work on. From there,
open the `INSTRUCTIONS.md` file and follow the instructions there.

If you'd like to work on an extra credit, but you want to skip the preceding
steps, you can run `node go` again:

```shell
node go
```

This will let you choose the next exercise or you can choose which part of the
exercise you'd like to work on. This will update your `exercise` files to the
correct version for you to work on that extra credit.

## Workshop Outline

> Snuggle up next to the 🔥 with a good 📚

👋 I'm Kent C. Dodds

- 🏡 Utah
- 👩 👧 👦 👦 👦 🐕
- 🏢 https://kentcdodds.com
- 🐦 https://twitter.com/kentcdodds
- 🐙 https://github.com/kentcdodds
- 🏆 https://TestingJavaScript.com
- 👨‍🚀 https://EpicReact.Dev
- 🥚 https://kcd.im/egghead
- 🥋 https://kcd.im/fem
- 💌 https://kcd.im/news
- 📝 https://kcd.im/blog
- 📺 https://kcd.im/devtips
- 💻 https://kcd.im/coding
- 📽 https://kcd.im/youtube
- 🎙 https://kcd.im/3-mins
- ❓ https://kcd.im/ama

### Schedule

> This workshop is a bit different from my other workshops. The exercises are
> much longer and you'll have more time to complete them. We'll also be taking
> breaks mid-exercise, wherever there's a need. So consider this schedule to be
> very loose.

#### Part 1

- 😴 Logistics
- 💪 01. Bootstrap
- 😴 10 Minutes
- 💪 02. Styles
- 🌮 30 Minutes
- 💪 03. Data Fetching
- 😴 10 Minutes
- ❓ Q&A

#### Part 2

- 😴 Logistics
- 💪 04. Authentication
- 😴 10 Minutes
- 💪 05. Routing
- 🌮 30 Minutes
- 💪 06. Cache Management
- ❓ Q&A

#### Part 3

- 😴 Logistics
- 💪 07. Context
- 😴 10 Minutes
- 💪 08. Flexible Component
- 🌮 30 Minutes
- 💪 09. Performance
- 😴 10 Minutes
- 💪 10. Render as you fetch
- ❓ Q&A

#### Part 4

- 😴 Logistics
- 💪 11. Unit Testing
- 😴 10 Minutes
- 💪 12. Testing Hooks and Components
- 🌮 30 Minutes
- 💪 13. Integration Testing
- 😴 10 Minutes
- 💪 14. E2E Testing
- ❓ Q&A

### Questions

Please do ask! Interrupt me. If you have an unrelated question, please ask on
[my AMA](https://kcd.im/ama).

### Zoom (for remote workshops)

- Help us make this more human by keeping your video on if possible
- Keep microphone muted unless speaking
- Breakout rooms

### Exercises

The exercises are in different branches. Each branch changes the
`INSTRUCTIONS.md` file to contain instructions you need to complete the
exercise.

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

### Helpful Emoji 🐨 💪 🏁 💰 💯 🦉 📜 💣 👨‍💼 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala Bear** 🐨 will tell you when there's something specific you
  should do
- **Matthew the Muscle** 💪 will indicate what you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
  version
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Peter the Product Manager** 👨‍💼 helps us know what our users want
- **Alfred the Alert** 🚨 will occasionally show up in the test failures with
  potential explanations for why the tests are failing.

### Workflow

- Checkout the exercise branch
- Read through the `INSTRUCTIONS.md`
- Start exercise
- Go through every mentioned file and follow the instructions from the emoji
- We all come back together
- I go through the solution and answer questions
- Move on to the next exercise.
- Repeat.

### App Data Model

- User

  - id: string
  - username: string

- List Item

  - id: string
  - bookId: string
  - ownerId: string
  - rating: number (-1 is no rating, otherwise it's 1-5)
  - notes: string
  - startDate: number (`Date.now()`)
  - finishDate: number (`Date.now()`)

> For convenience, our friendly backend engineers also return a `book` object on
> each list item which is the book it's associated to. Thanks backend folks!

> /me wishes we could use GraphQL

If your "database" gets out of whack, you can purge it via:

```javascript
window.__bookshelf.purgeUsers()
window.__bookshelf.purgeListItems()
```

- Book

  - id: string
  - title: string
  - author: string
  - coverImageUrl: string
  - pageCount: number
  - publisher: string
  - synopsis: string

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go to this URL to give overall feedback.
Thank you!

- Part 1: https://kcd.im/bra1-ws-feedback
- Part 2: https://kcd.im/bra2-ws-feedback
- Part 3: https://kcd.im/bra3-ws-feedback

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://vojta.io"><img src="https://avatars2.githubusercontent.com/u/25487857?v=4" width="100px;" alt=""/><br /><sub><b>Vojta Holik</b></sub></a><br /><a href="#design-vojtaholik" title="Design">🎨</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=vojtaholik" title="Code">💻</a></td>
    <td align="center"><a href="https://richardkaufman.dev"><img src="https://avatars0.githubusercontent.com/u/80982?v=4" width="100px;" alt=""/><br /><sub><b>Richard B. Kaufman-López</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=Sparragus" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SekibOmazic"><img src="https://avatars1.githubusercontent.com/u/3735902?v=4" width="100px;" alt=""/><br /><sub><b>Sekib Omazic</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=SekibOmazic" title="Documentation">📖</a></td>
    <td align="center"><a href="https://stackshare.io/jdorfman/decisions"><img src="https://avatars1.githubusercontent.com/u/398230?v=4" width="100px;" alt=""/><br /><sub><b>Justin Dorfman</b></sub></a><br /><a href="#fundingFinding-jdorfman" title="Funding Finding">🔍</a></td>
    <td align="center"><a href="http://nashkabbara.com"><img src="https://avatars3.githubusercontent.com/u/31865?v=4" width="100px;" alt=""/><br /><sub><b>Nash Kabbara</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=nkabbara" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=nkabbara" title="Code">💻</a> <a href="https://github.com/kentcdodds/bookshelf/issues?q=author%3Ankabbara" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://in.linkedin.com/in/umr55766"><img src="https://avatars0.githubusercontent.com/u/16179313?v=4" width="100px;" alt=""/><br /><sub><b>UMAIR MOHAMMAD</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=umr55766" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/onemen"><img src="https://avatars0.githubusercontent.com/u/3650909?v=4" width="100px;" alt=""/><br /><sub><b>onemen</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=onemen" title="Code">💻</a></td>
    <td align="center"><a href="https://www.redd.one"><img src="https://avatars3.githubusercontent.com/u/14984911?v=4" width="100px;" alt=""/><br /><sub><b>Artem Zakharchenko</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=kettanaito" title="Code">💻</a></td>
    <td align="center"><a href="http://htttp://www.leonardoelias.me"><img src="https://avatars2.githubusercontent.com/u/1995213?v=4" width="100px;" alt=""/><br /><sub><b>Leonardo Elias</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=leonardoelias" title="Code">💻</a></td>
    <td align="center"><a href="http://motdde.com"><img src="https://avatars1.githubusercontent.com/u/12215060?v=4" width="100px;" alt=""/><br /><sub><b>Oluwaseun Oyebade</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/issues?q=author%3Amotdde" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.wesbos.com"><img src="https://avatars2.githubusercontent.com/u/176013?v=4" width="100px;" alt=""/><br /><sub><b>Wes Bos</b></sub></a><br /><a href="#ideas-wesbos" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/awareness481"><img src="https://avatars3.githubusercontent.com/u/12380586?v=4" width="100px;" alt=""/><br /><sub><b>Jesse Jafa</b></sub></a><br /><a href="#ideas-awareness481" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/hd4ng"><img src="https://avatars1.githubusercontent.com/u/29898753?v=4" width="100px;" alt=""/><br /><sub><b>Huy Dang</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/issues?q=author%3Ahd4ng" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[yarn]: https://yarnpkg.com/
[build-badge]: https://img.shields.io/travis/kentcdodds/bookshelf.svg?style=flat-square&logo=travis
[build]: https://travis-ci.org/kentcdodds/bookshelf
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/react-fundamentals/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/bookshelf/blob/master/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/bookshelf/issues/new
[win-build-badge]: https://img.shields.io/appveyor/ci/kentcdodds/bookshelf.svg?style=flat-square&logo=appveyor
[win-build]: https://ci.appveyor.com/project/kentcdodds/bookshelf
<!-- prettier-ignore-end -->
