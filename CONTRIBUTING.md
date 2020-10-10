# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_
series [How to Contribute to an Open Source Project on GitHub][egghead]

## READ THIS PLEASE

Due to the way this project works, each of the exercises is self-contained in a
branch that starts with `exercises/` which is _only one commit_ off of master.
This is critically important for the tooling that we have to make it easy to
manage the exercises over time.

Unfortunately, because of this requirement, it's impossible to merge PRs that
are made to exercise branches (because it's impossible to maintain the
one-commit requirement).

So, if you want to make a change to one of the `exercises/` branches, you're
welcome to open a pull request, but I will have to apply any needed changes
myself and will close your PR (though I will still add you to the contributors
table).

If your changes are to the `main` branch, then the pull request workflow is
normal.

## Project setup

1.  Fork and clone the repo
2.  Run `npm run setup -s` to install dependencies and run validation
3.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

> Tip: Keep your `main` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/kentcdodds/bookshelf.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main` branch
> to use the upstream main branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `main` branch. Whenever you
> want to update your version of `main`, do a regular `git pull`.

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]:
  https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[issues]: https://github.com/kentcdodds/bookshelf/issues
