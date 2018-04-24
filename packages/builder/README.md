# scicad-builder

## Electron Packager Instructions

Run the following to generate the packager (from the root of SciCAD):
```bash
yarn upgrade:micropede
yarn bootstrap
yarn build
cd electron-packager
yarn packager
```

You may wish to modify the settings found in 
```
SciCAD/electron-packager.config.js
```
