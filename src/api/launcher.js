import request from '../axios/index'

/**
 * 取得訂單資訊
 * @param {String 商戶id} merchant_id
 * @param {String 訂單編號} key
 * @returns
 */
export function launcherGetTransaction (merchant_id, key) {
  return request({
    url: `/launcher/${merchant_id}/key/${key}`,
    method: 'get'
  })
}

/**
 * 發送銀行帳戶審核請求
 * @param {String 商戶id} merchant_id
 * @param {String 訂單編號} key
 * @param {Object bank_name 銀行名稱 bank_branch 分行名稱 account_name 帳戶持有人名稱 account_number 帳號} data
 * @returns
 */
export function launcherCreateReview (merchant_id, key, data) {
  return request({
    url: `/launcher/${merchant_id}/key/${key}/review`,
    method: 'post',
    data: data
  })
}

/**
 * 取得審核處理狀態
 * @param {String 商戶id} merchant_id
 * @param {String 訂單編號} key
 * @returns response中的data.status = 1時為待審核, status = 2時表示已有通道可選(payment_channels), status = 7時表示審核失敗
 */
export function launcherGetReview (merchant_id, key) {
  return request({
    url: `/launcher/${merchant_id}/key/${key}/review`,
    method: 'get'
  })
}

/**
 * 設定支付通道與支付帳戶, 訂單為入款需看response body內容, 出款如果沒回覆錯誤可返回畫面
 * @param {String 商戶id} merchant_id
 * @param {String 訂單編號} key
 * @returns
 */
export function launcherSetTransactionPayment (merchant_id, key, data) {
  return request({
    url: `/launcher/${merchant_id}/key/${key}/payment`,
    method: 'post',
    data: data
  })
}

/**
 * 取得入款訂單帳戶資訊
 * @param {String 商戶id} merchant_id
 * @param {String 訂單編號} key
 * @returns
 */
export function launcherGetTransactionDepositPayment (merchant_id, key) {
  return request({
    url: `/launcher/${merchant_id}/key/${key}/payment`,
    method: 'get'
  })
}
