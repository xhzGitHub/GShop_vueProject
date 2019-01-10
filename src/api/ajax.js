/*
ajax请求函数模块
返回值：promise对象（异步返回的数据是: response.data）
 */

import axios from 'axios'

export default function ajax(url, data={}, type='GET') {

  return new Promise(function (resolve, reject) {
    // 执行异步ajax请求
    let promise;
    if(type === 'GET'){
      let dataStr = '';
      Object.keys(data).forEach(key => {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
        url = url + '?' + dataStr;
      })
      promise = axios.get(url);
    }else{
      promise = axios.post(url, data);
    }

    // 成功了调用result()
    promise.then(function (response) {
      resolve(response.data)
    })
    // 失败了调用reejct()
      .catch(function (error) {
        reject(error)
      })

  })

}
