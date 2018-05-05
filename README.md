<p align="center">
<br/>
<img src="https://raw.githubusercontent.com/The-Brainery/SciCAD/master/docs/logo.png" width=150 />
  <br/><br/>
  <br/>

<a href="https://travis-ci.org/The-Brainery/SciCAD">
    <img alt="Build Status" src="https://travis-ci.org/The-Brainery/SciCAD.svg?branch=master"/>
</a>
<a href="https://ci.appveyor.com/project/SciBots/SciCAD">
  <img alt="Build Status" src="https://ci.appveyor.com/api/projects/status/am9mpa48m038s7ec?svg=true"/>
</a>
</p>


# Note:

This is the actively developed fork of the original microdrop-3 software package. For customers who purchased a DropBot from Sci-Bots, please see the original project (https://github.com/sci-bots/microdrop-3).


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
  >> scicad
```

## Building an installer:

```sh
cd SciCAD
cd packages/builder
yarn builder
```

## Docs

**[Visit project wiki](https://github.com/The-Brainery/SciCAD/wiki)**

## Acknowledgements: 

This software was originally funded via contract work from Sci-Bots ran by: Ryan Fobel, and Christian Fobel
(https://sci-bots.com/). With the focus being to develop a new software platform for their open source hardware project: DropBot (http://microfluidics.utoronto.ca/dropbot/), with the software titled: Microdrop-3. 

Unfortunately, the DropBot component of this project will no longer be maintained by myself; to ensure compatibility for Sci-Bots' DropBot customers I have forked and renamed the project to avoid confusion. For Sci-Bots customers, please see: https://github.com/sci-bots/microdrop-3. 

Ryan and Christian funded my developments of this project for almost a year, and in thanks, I have decided to rename the software "SciCAD" as homage to Sci-Bots.

Original developments of what later would become SciCAD arose from my fourth year project: DropLab. My team included myself along with: Abdullah Abbas, Josh Reid, and Kamyar Ghofrani.
(https://www.youtube.com/watch?v=W8F3uWKRhpo)

This project was also awarded the Autodesk Canada Capstone Design Award (https://uwaterloo.ca/capstone-design/autodesk-canada-capstone-design-award) in 2017.

