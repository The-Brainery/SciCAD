# @scicad/builder nsis instructions

1. Run electron-packager.config.js (in root of @scicad/builder)
2. Run init.js in the nsis directory; this will fetch the output of electron packager, and bundle with miniconda
4. Create a 7-zip archive of the SciCAD folder in the nsis directory (right click SciCAD -> 7-Zip -> Add to "SciCAD.7z")
5. Configure the script.nsh file if necessary
6. Run makensis.exe (I prefer to use the MakeNSIS: Compile command from build-makensis Atom package)
