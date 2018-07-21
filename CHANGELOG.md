# Changelog
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added functionality to allow each individual header to be turned off. This can be configured by setting one of; headers.id, headers.date and headers.responseTime to false in the options object passed to KoaReqLogger.
- Added functionality to allow all headers to be disabled by setting headers to false in the options object passed to KoaReqLogger.

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
[Unreleased]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/DrBarnabus/koa-req-logger/compare/v1.0.0...v1.1.0