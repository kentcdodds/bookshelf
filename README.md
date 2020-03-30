# Build a ReactJS App - Bookshelf

👋 hi there! My name is [Kent C. Dodds](https://kentcdodds.com) and this is the
source material for
[Build a ReactJS App](https://kentcdodds.com/workshops/build-react-apps)!

[![Travis Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![GPL-3.0 License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

## Pre-Workshop Instructions/Requirements

**NOTE: This repository is used for a two-part workshop**

In order for us to maximize our efforts during the workshop, please complete the
following things to prepare.

- 📺 only necessary if the workshop is remote via Zoom
- 👋 specific to the material for this workshop
- 2️⃣ Only needed to prepare for part 2 of this workshop

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
- [ ] 👋 2️⃣ Go through my
      [Advanced React Hooks](https://kentcdodds.com/workshops/advanced-react-hooks),
      or have the equivalent basic experience of using advanced hooks. You
      should be experienced with `useContext`, `useReducer`, `useMemo`, and
      `useCallback`.

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

You can also open
[the deployment of the app on Netlify](https://the-react-bookshelf.netlify.app/).

## Running the tests

```shell
npm test
```

This will start [Jest](https://jestjs.io/) in watch mode. Read the output and
play around with it. The tests are there to help you reach the final version,
however _sometimes_ you can accomplish the task and the tests still fail if you
implement things differently than I do in my solution, so don't look to them as
a complete authority.

## Workshop Outline

> Snuggle up next to the 🔥 with a good 📚

👋 I'm Kent C. Dodds

- 🏡 Utah
- 👩 👧 👦 👦 👦 🐕
- 🏢 kentcdodds.com
- 🐦/🐙 @kentcdodds
- 🏆 testingjavascript.com
- 🥚 kcd.im/egghead
- 🥋 kcd.im/fem
- 💌 kcd.im/news
- 📝 kcd.im/blog
- 📺 kcd.im/devtips
- 💻 kcd.im/coding
- 📽 kcd.im/youtube
- 🎙 kcd.im/3-mins
- ❓ kcd.im/ama

### Schedule

#### Part 1

- 😴 Logistics
- 💪 01. TODO
- 💪 02. TODO
- 😴 10 Minutes
- 💪 03. TODO
- 💪 04. TODO
- 🌮 30 Minutes
- 💪 05. TODO
- 💪 06. TODO
- 😴 10 Minutes
- 💪 07. TODO
- 💪 08. TODO
- 😴 10 Minutes
- 💪 09. TODO
- ❓ Q&A

#### Part 2

- 😴 Logistics
- 💪 01. TODO
- 💪 02. TODO
- 😴 10 Minutes
- 💪 03. TODO
- 💪 04. TODO
- 🌮 30 Minutes
- 💪 05. TODO
- 💪 06. TODO
- 😴 10 Minutes
- 💪 07. TODO
- 💪 08. TODO
- 😴 10 Minutes
- 💪 09. TODO
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

- Part 1: https://kcd.im/bra-ws-feedback
- Part 2: https://kcd.im/braa-ws-feedback

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
    <td align="center"><a href="http://nashkabbara.com"><img src="https://avatars3.githubusercontent.com/u/31865?v=4" width="100px;" alt=""/><br /><sub><b>Nash Kabbara</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=nkabbara" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=nkabbara" title="Code">💻</a></td>
    <td align="center"><a href="https://in.linkedin.com/in/umr55766"><img src="https://avatars0.githubusercontent.com/u/16179313?v=4" width="100px;" alt=""/><br /><sub><b>UMAIR MOHAMMAD</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=umr55766" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/onemen"><img src="https://avatars0.githubusercontent.com/u/3650909?v=4" width="100px;" alt=""/><br /><sub><b>onemen</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=onemen" title="Code">💻</a></td>
    <td align="center"><a href="https://www.redd.one"><img src="https://avatars3.githubusercontent.com/u/14984911?v=4" width="100px;" alt=""/><br /><sub><b>Artem Zakharchenko</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=kettanaito" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## License

This material is available for private, non-commercial use under the
[GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html). If you
would like to use this material to conduct your own workshop, please contact me
at me@kentcdodds.com

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[yarn]: https://yarnpkg.com/
[build-badge]: https://img.shields.io/travis/kentcdodds/bookshelf.svg?style=flat-square&logo=travis
[build]: https://travis-ci.org/kentcdodds/bookshelf
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/bookshelf/blob/master/README.md#license
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
