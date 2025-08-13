# vite-demo

This setup achieves two goals:

1. Call three.js from TypeScript and show type errors in the editor.
2. Allow the Chrome debugger to step into the three.js source code.

# Initial setup

Based on https://www.youtufbe.com/watch?v=p4BHphMBlFA 

* Create a new repo on GitHub with a LICENSE file (to make the repo non-empty)
* npm i -g npm@latest
* npm install -g vite@latest
* cd \git
* git clone https://github.com/dominicprior/vite-demo
* cd vite-demo
* npm init vite@latest .   (I used a cmd.exe because this command didn't display its options properly in a git bash prompt)
  * ignore files and continue
  * vanilla
  * typeScript
* npm install
* (I didn't do "npm install three" since I want local stuff I can edit or step into)
* npm run dev (from the VSCode terminal)  -  it launched a localhost server showing the Vite demo webpage

# To install on a new device

* Install Node.js, VS Code and Git.
* git clone
* npm i
* Inside VS Code, npm run dev
* Maybe type this: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Copied files

* `three/threebuild/three_core.js` from `r177 Three.js`.  Note the underscore instead of the dot.
* Ditto for `three_module.js`.
* `three/src/**/*.d.ts` from an `npm install @types/three`.

# Jest

I followed the instructions from here: https://jestjs.io/docs/getting-started and then gave up, due to
https://jestjs.io/docs/getting-started#:~:text=Jest%20is%20not%20supported%20by%20Vite

# Vitest

I worked from this: https://vitest.dev/guide/

