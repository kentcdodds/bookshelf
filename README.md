<div>
  <h1 align="center"><a href="https://epicreact.dev">Build an Epic React App 🚀 EpicReact.Dev</a></h1>
  <strong>
    Building a full React application
  </strong>
  <p>
    The React and JavaScript ecosystem is full of tools and libraries to help
    you build your applications. In this (huge) workshop we’ll build an
    application from scratch using widely supported and proven tools and
    techniques. We’ll cover everything about building frontend React
    applications, from the absolute basics to the tricky parts you'll run into
    building real world React apps and how to create great abstractions.
  </p>

  <a href="https://epicreact.dev">
    <img
      alt="Learn React from Start to Finish"
      src="https://kentcdodds.com/images/epicreact-promo/er-1.gif"
    />
  </a>
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![GPL 3.0 License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## Prerequisites

- You'll want experience with React before going through this material. The
  lessons get progressively more advanced. Once you hit something you're
  unfamiliar with, that's your cue to go back and review the other parts of
  EpicReact.Dev.

## System Requirements

- [git][git] v2.13 or greater
- [NodeJS][node] `^10.13 || 12 || 14`
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

> If you want to commit and push your work as you go, you'll want to
> [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/bookshelf.git
cd bookshelf
node setup
```

This may take a few minutes.

If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please [file an
issue][issue] and provide _all_ the output from the commands you ran (even if
it's a lot).

If you can't get the setup script to work, then just make sure you have the
right versions of the requirements listed above, and run the following commands:

```
npm install
npm run validate
```

It's recommended you run everything locally in the same environment you work in
every day, but if you're having issues getting things set up, you can also set
this up using [GitHub Codespaces](https://github.com/features/codespaces)
([video demo](https://www.youtube.com/watch?v=gCoVJm3hGk4)) or
[Codesandbox](https://codesandbox.io/s/github/kentcdodds/bookshelf).

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
open the `INSTRUCTIONS.md` file and follow the instructions.

If you'd like to work on an extra credit, but you want to skip the preceding
steps, you can run `node go` again:

```shell
node go
```

This will let you choose the next exercise or you can choose which part of the
exercise you'd like to work on. This will update your `exercise` files to the
correct version for you to work on that extra credit.

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

- **Kody the Koala** 🐨 will tell you when there's something specific you should
  do
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

## Troubleshooting

<details>
  
  <summary>Running "node go" does not list any branches</summary>
  
This means there was something wrong when you ran the setup. Try running:

```
node ./scripts/track-branches.js
```

If you're still not getting the branches, then you can do this manually:

```
git branch --track "exercises/01-bootstrap" "origin/exercises/01-bootstrap"
git branch --track "exercises/02-styles" "origin/exercises/02-styles"
git branch --track "exercises/03-data-fetching" "origin/exercises/03-data-fetching"
git branch --track "exercises/04-authentication" "origin/exercises/04-authentication"
git branch --track "exercises/05-routing" "origin/exercises/05-routing"
git branch --track "exercises/06-cache-management" "origin/exercises/06-cache-management"
git branch --track "exercises/07-context" "origin/exercises/07-context"
git branch --track "exercises/08-compound-components" "origin/exercises/08-compound-components"
git branch --track "exercises/09-performance" "origin/exercises/09-performance"
git branch --track "exercises/10-render-as-you-fetch" "origin/exercises/10-render-as-you-fetch"
git branch --track "exercises/11-unit-testing" "origin/exercises/11-unit-testing"
git branch --track "exercises/12-testing-hooks-and-components" "origin/exercises/12-testing-hooks-and-components"
git branch --track "exercises/13-integration-testing" "origin/exercises/13-integration-testing"
git branch --track "exercises/14-e2e-testing" "origin/exercises/14-e2e-testing"

git pull --all
```

</details>

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
  <tr>
    <td align="center"><a href="https://gabrielabud.com"><img src="https://avatars3.githubusercontent.com/u/7684770?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel Abud</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=Buuntu" title="Documentation">📖</a></td>
    <td align="center"><a href="https://kodyclemens.com"><img src="https://avatars0.githubusercontent.com/u/43357615?v=4" width="100px;" alt=""/><br /><sub><b>Kody Clemens</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=kodyclemens" title="Documentation">📖</a></td>
    <td align="center"><a href="http://cale.xyz"><img src="https://avatars3.githubusercontent.com/u/12165290?v=4" width="100px;" alt=""/><br /><sub><b>calec</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=calec" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/emzoumpo"><img src="https://avatars2.githubusercontent.com/u/2103443?v=4" width="100px;" alt=""/><br /><sub><b>Emmanouil Zoumpoulakis</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=emzoumpo" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/milamer"><img src="https://avatars2.githubusercontent.com/u/12884134?v=4" width="100px;" alt=""/><br /><sub><b>Christian Schurr</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=milamer" title="Code">💻</a> <a href="https://github.com/kentcdodds/bookshelf/issues?q=author%3Amilamer" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.b2m9.com"><img src="https://avatars1.githubusercontent.com/u/8492232?v=4" width="100px;" alt=""/><br /><sub><b>Bob Massarczyk</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=b2m9" title="Documentation">📖</a></td>
    <td align="center"><a href="https://radiant-sands-51546.herokuapp.com/profile/deepak.chandani"><img src="https://avatars0.githubusercontent.com/u/15975603?v=4" width="100px;" alt=""/><br /><sub><b>Deepak Chandani</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=deepak-chandani" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://frontendwizard.dev"><img src="https://avatars1.githubusercontent.com/u/1124448?v=4" width="100px;" alt=""/><br /><sub><b>Juliano Farias</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=frontendwizard" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/RobbertWolfs"><img src="https://avatars2.githubusercontent.com/u/12511178?v=4" width="100px;" alt=""/><br /><sub><b>Robbert Wolfs</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=RobbertWolfs" title="Documentation">📖</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=RobbertWolfs" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/komisz"><img src="https://avatars3.githubusercontent.com/u/45998348?v=4" width="100px;" alt=""/><br /><sub><b>komisz</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/issues?q=author%3Akomisz" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="#projectManagement-MichaelDeBoey" title="Project Management">📆</a> <a href="https://github.com/kentcdodds/bookshelf/commits?author=MichaelDeBoey" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/marcosvega91"><img src="https://avatars2.githubusercontent.com/u/5365582?v=4" width="100px;" alt=""/><br /><sub><b>Marco Moretti</b></sub></a><br /><a href="https://github.com/kentcdodds/bookshelf/commits?author=marcosvega91" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go to this URL to give overall feedback.
Thank you!

- Part 1: https://kcd.im/bra1-ws-feedback
- Part 2: https://kcd.im/bra2-ws-feedback
- Part 3: https://kcd.im/bra3-ws-feedback
- Part 4: https://kcd.im/bra4-ws-feedback

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[build-badge]: https://img.shields.io/travis/kentcdodds/bookshelf.svg?style=flat-square&logo=travis
[build]: https://travis-ci.com/kentcdodds/bookshelf
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/bookshelf/blob/main/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/bookshelf/blob/main/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/bookshelf/issues/new
[win-build-badge]: https://img.shields.io/appveyor/ci/kentcdodds/bookshelf.svg?style=flat-square&logo=appveyor
[win-build]: https://ci.appveyor.com/project/kentcdodds/bookshelf
<!-- prettier-ignore-end -->
