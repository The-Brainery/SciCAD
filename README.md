<p align="center">
  <img src="https://raw.githubusercontent.com/The-Brainery/SciCAD/master/docs/logo.png" width=150 />
</p>

[![Build Status](https://travis-ci.org/The-Brainery/SciCAD.svg?branch=master)](https://travis-ci.org/The-Brainery/SciCAD)
[![Build status](https://ci.appveyor.com/api/projects/status/am9mpa48m038s7ec?svg=true)](https://ci.appveyor.com/project/SciBots/SciCAD)


## Installing From Source (Latest)

### Prerequisites:
- git
- node / npm

### Installation:
```sh
git clone --recursive https://github.com/The-Brainery/SciCAD
cd SciCAD
npm i --global yarn electron @yac/yac npm-check-updates lerna
yarn upgrade:micropede
yarn upgrade:yac
lerna bootstrap
yarn build # This can sometimes appear to hang on windows when it has actually complected. Press <Enter> and/or Ctrl+C if it appears to have stalled for over 30s or so
yarn start
```

## Installing From NPM:

### Prerequisites:
- git
- node / npm

### Installation:
```sh
npm install --global @scicad/application
```

### Start:
```sh
  >> scicad # Ensure scicad-2 is not in path
```

## Building an installer:

```sh
cd SciCAD
cd packages/builder
yarn builder
```

## Docs

**[Visit project wiki](https://github.com/The-Brainery/SciCAD/wiki)**
