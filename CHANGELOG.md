# Changelog
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.3] - 2019-08-02
### Changed
- Updated package dependencies.

## [1.5.1] - 2018-09-20
### Fixed
- Rebuilt the package and republished as the previous version didn't build correctly.

## [1.5.0] - 2018-09-19
### Changed
- **Breaking Change:** To support user supplied instances of Pino and extreme mode, the way that options are passed to pino has been changed significantly. Please refer to the new documentation to see how to update your implementation of KoaReqLogger.

## [1.4.0] - 2018-09-04
### Changed
- Changed the options to disable the headers again, the conversion to TypeScript left them reversed so the option enabled it as opposed to disabling. The options are now called disableIdHeader, disableDateHeader and disableResponseTimeHeader. If any set to true, the corresponding header will be disabled.
### Fixed
- Fixed an issue where the header disable options were reversed due to the TypeScript conversion.
- FIxed a typo in readme documentation.

## [1.3.8] - 2018-09-03
### Changed
- Updated README to reflect import for JavaScript.

## [1.3.3] - 2018-09-03
### Fixed
- Fixed default export so that the module works correctly in JavaScript projects.

## [1.3.2] - 2018-09-03
### Fixed
- Added default export so that the module works correctly in JavaScript projects.

## [1.3.1] - 2018-09-03
### Fixed
- Fixed npmignore to include build JavaScript files.

## [1.3.0] - 2018-09-03
### Added
- Added a TypeScript type declaration file so that the module can be more easily used in a typescript project.
### Changed
- Updated package dependencies.
- Updated README.md with examples of usage in TypeScript.
- Updated API Reference documentation.
- **Breaking Change** to disable specific headers or all headers, you are now required to set idHeader, dateHeader and responseTimeHeader respectively. To disable all headers all three options must be set.

## [1.2.2] - 2018-08-08
### Changed
- Updated package dependencies to use the latest version of pino v5.0.1 as a minimum.

## [1.2.1] - 2018-08-01
### Fixed
- Fixed an issue where the logger didn't correctly handle errors thrown without a status. These are now handled as status 500 internal server errors to prevent it not being logged. An example would be <code>throw new Error('Generic Error with no Status');</code> which will now respond with a generic status 500 error.

## [1.2.0] - 2018-07-23
### Added
- Added functionality to allow each individual header to be turned off. This can be configured by setting one of; headers.id, headers.date and headers.responseTime to false in the options object passed to KoaReqLogger.
- Added functionality to allow all headers to be disabled by setting headers to false in the options object passed to KoaReqLogger.
- Added tests to get code coverage up to 100%.
- Added API Reference file, documents the options that are available when creating a new instance of KoaReqLogger.
- Added ci to test builds, badges also added to readme to show build status.
### Changed
- By default, errors are now logged as warnings. If the error status is 5** then the error is logged as an error. But this can be changed back to the original behavior, by setting alwaysError to true in the options object passed to KoaReqLogger.
### Fixed
- Fixed a problem in the readme file example where the wrong class name was used.

## [1.1.0] - 2018-07-21
### Added
- Functionality to override the uuidv4 that is used automatically for the X-Request-ID with your own uuid function.
- Updated the readme file, with an example of log usage in a request.
### Fixed
- Fixed an issue where response object wasn't populated correctly in the log.

## 1.0.0 - 2018-07-20
First release of the package.
### Added
- Added this CHANGELOG file to keep track of changes.
- Implemented the middleware with configureable serializers standard are inserted automatically. Remaining options are just passed to pino without any validation at present.
- Implemented basic tests to ensure that the 3 HTTP Headers; Date, X-Request-ID and X-Response-Time are added to the response correctly.
- Documented the fix for an issue that was encounted when using the koa-router package.



<!-- LINKS --->
[1.5.3]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.5.2...v1.5.3
[1.5.1]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.3.8...v1.4.0
[1.3.8]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.3.3...v1.3.8
[1.3.3]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.0.0...v1.1.0