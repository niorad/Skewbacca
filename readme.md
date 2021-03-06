# Skewbacca

**I rewrote this in Swift, so it will probably never be updated again**
https://github.com/niorad/Skewbacca-Native

by niorad for [DevLids.com](https://DevLids.com)

An electron-app to quickly un-skew laptop-lids from photos, and create a file which is ready for usage on DevLids.
Needs ImageMagick ("convert") to be available.
Only tested on OSX so far.

## Features so far

- Placing four points on each corner of a lid via drag & drop (the red handle has to be placed on the upper left corner of the lid)
- Generation and display of un-skewed image via ImageMagick
- Saving the result to a new image
- Opening images via Drag & Drop into the window

## Ideas/Plans

- Remove ImageMagick-Dependency, maybe there's something similar for Node.js?

## Getting started

- brew install imagemagick (needs to be executable from anywhere)
- yarn install
- Test: yarn test
- Build TypeScript and start app: yarn start

## Using

- Electron
- ImageMagick for the image-conversion
- TypeScript for all things JS
- Spectron and Mocha for testing
