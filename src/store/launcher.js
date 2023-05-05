import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLauncherInfoStore = defineStore('LauncherInfo', () => {
  const BankInfo = ref({
    bank_name: '', //銀行名稱
    bank_branch: '', //分行名稱
    account_name: '', //帳戶持有人名稱
    account_number: '' //帳號
  })

  const ParamInfo = ref({
    merchant_id: '',
    key: '',
    expire_at: '',
    type: ''
  })

  const SetBankInfo = val => {
    BankInfo.value = val
  }

  const SetParamInfo = val => {
    ParamInfo.value = val
  }

  return {
    BankInfo,
    SetBankInfo,
    ParamInfo,
    SetParamInfo
  }
})
