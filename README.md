# Les Petits Plats

## Usage

### Installation

To setup the project locally, you need to meet the following requirements:

- Git
- NodeJS (Version >=16, prefer installation using [NVM](https://github.com/nvm-sh/nvm))
- PNPM (Install with `npm i -g pnpm`)
- Docker (Not required but useful if playwright is not compatible with your environment)

Once everything is installed, you can clone the project locally with the following command:

```shell
git clone git@github.com:Zuruuh/les-petits-plats.git
cd les-petits-plats
```

Then, install all the npm dependencies with `pnpm install`.

### Development

To run the project locally, use the npm script _dev_ with `pnpm run dev`, and the project will be served locally at http://localhost:5173.
You will benefit from ViteJS Hot Module Replacement which will update all your code directly in your browser when you edit it.

### Benchmarking

Playwright is used to benchmark some features of this website (could be a good idea to test using it too in the future). To set it up locally, try to run the command `pnpm run playwright:install`.
If you receive an error message telling you that your os is not supported you can use the docker alternative by running `pnpm run docker:build`.

Once the installation step is done, simply run `pnpm run playwright:benchmark` (or `pnpm run docker:benchmark` if you are using docker) and everything should be good to go!

### Production

To build the project for production, simply run `pnpm run build` and you will get your prod-ready project in the _./dist_ folder.

## Tools

This project has multiple tools setup by default, let's take a look at all of them 🚀

- [Playwright](https://playwright.dev)
  - Playwright is an end-to-end test runner which is very easy to set up and get started with.
  - It allows developers to test quickly their web-app with multiple browsers & size screen.
- [Typescript](https://www.typescriptlang.org)
  - Allows to use a typing system during dev time before transpiling to javascript.
- [Sass](https://sass-lang.com)
  - Adds multiple features to css that will be transformed into css during build-time.  
    Example features: Nesting, Functions, Mixins, Variables, Inheritance
- Linters, Formatters, Static-Code Analyzers
  - [Prettier](https://prettier.io)
  - [Eslint](https://eslint.org)
  - [Stylelint](https://stylelint.io)
- [ViteJS](https://vitejs.dev)
  - Very popular module bundler which is known for its speed and fast-growing community.  
    It utilizes Hot Module Replacement to update your code directly in your browser without loosing its state and extremely fast.
- [PostCSS](https://postcss.org)
  - Tool used to apply modifications on css during build time, has a very large plugin ecosystem that can help a lot with common issues.
  * [Autoprefixer](https://autoprefixer.github.io)
    - Makes sure our css will support as much browsers as possible by adding custom vendor prefixes to css declarations that might behave differently depending on the browser interpreting it.
- [GitHub Actions](https://github.com/features/actions)
  - Continuous Integration
    - Since this project utilizes a lot ot linters, formatters, static-code analyzers, etc... Making sure they are correctly used is vital!  
      All linters are run whenever someone pushes on a branch, and they need to all pass in order to be able to merge a pull request.

### Additional notes

This project was scaffolded using [@zuruuh/create-vite](https://github.com/Zuruuh/create-vite), a self-made starter project using ViteJS and it's ecosystem and create-create-app.
