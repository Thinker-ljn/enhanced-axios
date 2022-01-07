# enhanced axios

在对接后端接口时，因为接口数据的多重封装（一般是多了一些业务信息如错误代码），前端需要解包多层，比如 HTTP 状态返回了 200，响应数据却返回了错误代码。

```js

const successResponse = {
  status: 200,
  statusText: 'ok',
  data: {
    code: 200,
    message: '成功',
    result: { /* 真正的数据 */ }
  }
}

const errorResponse = {
  status: 200,
  statusText: 'ok',
  data: {
    code: 500,
    message: '出错了'
  }
}

// 很多开发人员会编写如下的代码，明明响应成功了还要判断是否有业务错误
someServiceApi()
  .then((res) => {
    if (res.code === 0) {
      console.log(res.result)
    } else {
      console.log(res.message || '出错了')
    }
  }, (e) => {
    console.log(e.message || '出错了')
  })

```

本项目编写了不同的拦截器对一些常见行为的封装，提高业务的编写体验

1. 处理了不同后端项目可能参数不一致的问题。
2. 统一了 HTTP 401 的逻辑。
3. 提取了业务数据，直接在 Promise Resolve 时返回。
4. 把业务代码错误转为 Axios 的响应错误，统一在 Promise 在错误捕获。

## 使用

```js
import {
  enhancedAxios,
  // 用于生成自定义的 401 拦截器
  genIfUnauthorizedInterceptor,
} from 'enhanced-axios'

enhancedAxios(
  // axios 实例
  service,
  {
    // 成功的业务代码
    validBusinessCodes: [200],
    // 用户未认证的业务代码
    unanthorizedBusinessCodes: [10011039, 10011040, 10011041],
    // 业务数据与业务代码的别名, 默认是 code message data
    businessAlias: { data: 'result' },
    // 执行失败信息的函数，一般是UI组件的函数
    warning: (message: string) => notice('danger', message),
    // 执行成功信息的函数，一般是UI组件的函数
    success: (message: string) => notice('success', message),
    // 配置响应成功是否弹出信息
    _feedback: false,
    // 额外的拦截器配置
    interceptors: {
      request: [],
      response: [],
    },
  }
)


service({
  url: 'api-url',
  method: 'get',
  // 如上
  _feedback: '成功了',
  // 禁止弹出接口返回的 message 及配置的 _feedback
  _silent: true
}).then((businessData) => {
  // 获取业务数据
  console.log(businessData)
}, (error) => {
  // 捕获 http 错误或业务错误
  console.log(error)
  // 打印由插件默认生成的错误信息
  console.log(error._formatMessage())
})

```

[详细的配置信息请看：src/type.ts](src/type.ts)
