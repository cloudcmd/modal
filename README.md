# Modal [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage][CoverageIMGURL]][CoverageURL]

Lightbox library for displaying modals with api similar to [FancyBox v2](http://fancyapps.com/fancybox/).

![Modal](https://raw.githubusercontent.com/cloudcmd/modal/master/screen/modal.png "modal")

# Install

```
npm i @cloudcmd/modal
```

## How Come?

I used `fancybox` for a long time but there is a couple things I don't like about it:

- has not tests
- uses jquery
- big (`30kb` of `jquery` + `13kb` = `43kb` against `23kb` of `modal`)
- slow
- does not support `common.js`, `esm` etc
- license not compatible with `MIT`

`Modal` in the other hand:

- written on vanilla js
- has no extra dependencies
- has full test coverage
- does most stuff using `css`
- can be installed using `npm`
- supports `common.js`, `esm`
- contains `css` and `images` inside of a `js` bundle (for using with `webpack` see `webpack.config.js`)
- Api compatible with `fancybox`

# API

First things first, import `modal` with:

```js
import modal from '@cloudcmd/modal';
```

Using build file:

```html
<script src="./node_modules/@cloudcmd/modal/dist/modal.min.js"></script>
```

## open(el[, options])

```js
  const el = document.createElement('div');
  el.textContent = 'hello';
  
  // simplest possible modal open using existing html element
  modal.open(el);
  modal.close();
  
  // usage with title and hooks
  modal.open(el, {
    title: 'hello world',
    beforeOpen: () => console.log('before open'),
    afterOpen: () => console.log('after open'),
    beforeClose: () => console.log('before close'),
    afterClose: () => console.log('after close'),
    helpers: {
      title: true,
    }
  });
```

## open(images[, options])

```js
  const image = {
    title: 'hello',
    href: 'cloudcmd.png',
  };
  
  modal.open([image], {
    autoSize: true,
    helpers: {
      title: true,
    }
  })
```

## close

Close opened `modal` window:

```js
modal.close();
```

# License
MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/@cloudcmd/modal.svg?style=flat&longCache=true
[BuildStatusIMGURL]:        https://img.shields.io/travis/cloudcmd/modal/master.svg?style=flat&longCache=true
[DependencyStatusIMGURL]:   https://img.shields.io/david/cloudcmd/modal.svg?style=flat&longCache=true
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat&longCache=true

[NPMURL]:                   https://npmjs.org/package/@cloudcmd/modal "npm"
[BuildStatusURL]:           https://travis-ci.org/cloudcmd/modal  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/cloudcmd/modal "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/cloudcmd/modal?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/cloudcmd/modal/badge.svg?branch=master&service=github

