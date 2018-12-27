# Skewbacca

by niorad for [DevLids.com](https://DevLids.com)

An electron-app to quickly un-skew laptop-lids from photos, and create a file which is ready for usage on DevLids.
Needs ImageMagick ("convert") to be available.
Only tested on OSX so far.

## Features so far

- Placing four points on each corner of a lid via drag & drop (the red handle has to be placed on the upper left corner of the lid)
- Generation and display of un-skewed image via ImageMagick
- Saving the result to a new image
- Opening images via Drag & Drop into the window

## Getting started

- brew install imagemagick (needs to be executable from anywhere)
- yarn install
- Test: yarn test
- Build TypeScript and start app: yarn start

## Using

- Electron
- ImageMagick for the image-conversion
- TypeScript for the backend-ish part of Electron
- Plain JS for the renderer
- Spectron and Mocha for testing
