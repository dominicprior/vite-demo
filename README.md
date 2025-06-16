# vite-demo

Trying some Three.js and TypeScript

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

# Copied files

* `three/threebuild/three_core.js` from `r177 Three.js`.  Note the underscore instead of the dot.
* Ditto for `three_module.js`.
* `three/src/**/*.d.ts` from an `npm install @types/three`.

* Copy `three.core.js` and `three.module.js` from `june-three-js` to `three/threebuild` as `three_core.js` and `three_module.js`.
* Copy `three.core.d.ts` and `three.module.d.ts` from `C:\git\vite-demo-copy\node_modules\@types\three\build`, and change their (one-line) contents to lowercase and to underscores instead of dots.
* Copy * from `vite-demo-copy/node_modules/@types/three/src` to `three/src`.
* Add an importmap to `index.html`.
