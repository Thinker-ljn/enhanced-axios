# [2.0.0-rc.2](https://github.com/Thinker-ljn/enhanced-axios/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2026-08-20)


### Bug Fixes

* align enhanced instance method return types ([f05817c](https://github.com/Thinker-ljn/enhanced-axios/commit/f05817c84e403d7e1c7a6d85049efd83db22812a))
* make extra interceptor groups optional ([a94224a](https://github.com/Thinker-ljn/enhanced-axios/commit/a94224a860df7a924eb97e34f233f84d88bf2233))
* preserve falsy business code in formatted errors ([d94d5c1](https://github.com/Thinker-ljn/enhanced-axios/commit/d94d5c1db76ba70ceb2217a1d6349dc2260ca680))


### Features

* add unauthorizedBusinessCodes option ([9e7b09b](https://github.com/Thinker-ljn/enhanced-axios/commit/9e7b09bdbb4394fd795a49d2dc0d2ca878f4d2f9))
* parse business responses by code presence ([1001c1e](https://github.com/Thinker-ljn/enhanced-axios/commit/1001c1eda24bdabff1d945600eed6657b14b66be))
* support fallback business aliases ([a8e62eb](https://github.com/Thinker-ljn/enhanced-axios/commit/a8e62eba2b038a11fb50c06fcf1087866d4e8a71))



# [2.0.0-rc.1](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.2.1...v2.0.0-rc.1) (2026-07-17)


* feat!: upgrade axios to v1 ([c5ff827](https://github.com/Thinker-ljn/enhanced-axios/commit/c5ff8277589f1560659afa9815de5df4d47cc4ff))


### BREAKING CHANGES

* require axios ^1.0.0 and drop axios 0.x support.

  - add axios as a peer dependency
  - update development dependency to axios ^1.18.1
  - adapt interceptor and error types for Axios 1.x
  - externalize axios from build outputs



## [1.2.1](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.2.0...v1.2.1) (2023-09-18)


### Features

* add _formatCodeMessage ([232e055](https://github.com/Thinker-ljn/enhanced-axios/commit/232e055da9a53c78f03f1ddb5eda0d8bb31a9f92))



# [1.2.0](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.1.0...v1.2.0) (2023-09-01)


### Bug Fixes

* 过滤空的成功或错误的信息 ([8ee4ad3](https://github.com/Thinker-ljn/enhanced-axios/commit/8ee4ad357068fa3abba512ce0e0ee437bed9b40b))


### Features

* 增加中置拦截器 ([e6caacc](https://github.com/Thinker-ljn/enhanced-axios/commit/e6caacca2baf483f0b3f91d83f6e763a6f87b418))
* genIfUnauthorizedInterceptor 的参数回调函数中增加响应错误的参数 ([e5c4848](https://github.com/Thinker-ljn/enhanced-axios/commit/e5c48485c6058eb8b7297d02a0b512632a6a672c))



# [1.1.0](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.0.0-beta.1...v1.1.0) (2023-08-02)


### Bug Fixes

* cancel error ([8875fe7](https://github.com/Thinker-ljn/enhanced-axios/commit/8875fe72bc33cc2e50ee4182588112c12e1af97b))


### Features

* 添加前置拦截器、是否返回业务数据的配置项目 ([dbf3db5](https://github.com/Thinker-ljn/enhanced-axios/commit/dbf3db50679beec68c18694c19cba9d702283def))



## [1.0.1](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.0.0...v1.0.1) (2022-07-15)



# [1.0.0](https://github.com/Thinker-ljn/enhanced-axios/compare/v1.0.0-beta.1...v1.0.0) (2022-06-12)



# 1.0.0-beta.1 (2022-01-13)


### Bug Fixes

* 修复成功的提示逻辑 ([d9a969c](https://github.com/Thinker-ljn/enhanced-axios/commit/d9a969c0a896891f6cd6bd738e510c8e12d31dd6))


### Features

* 统一默认错误信息 ([db6c16e](https://github.com/Thinker-ljn/enhanced-axios/commit/db6c16ee6080da7e045edb2d37f241694816ec70))
* enhanced-axios ([ce4be56](https://github.com/Thinker-ljn/enhanced-axios/commit/ce4be560c859afb0cb9f7e9359fe2462c1dd57af))



