const packager = require('electron-packager');
const options = {
  dir: __dirname,
  derefSymlinks: true,
  overwrite: true,
  packageManager: false,
  name: 'SciCAD',
  asar: false,
  out: `${__dirname}/packager`,
  ignore: /(nsis)/
};

packager(options).then((d) => {
  console.log("packager done!");
});
