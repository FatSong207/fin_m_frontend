<template>
    <div>
        <a-spin :spinning="data.spinning" :tip="data.tip">
            <a-card>
                <template #title>
                    <CreditCardOutlined /> 銀行卡資訊
                </template>
                <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                    :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 12 }" :rules="data.rules">
                    <a-row>
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                            <a-form-item label="銀行名稱" name="bank_name">
                                <a-input v-model:value="data.editForm.bank_name" />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                            <a-form-item label="分行名稱" name="bank_branch">
                                <a-input v-model:value="data.editForm.bank_branch" />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                            <a-form-item label="持有人名稱" name="account_name">
                                <a-input v-model:value="data.editForm.account_name" />
                            </a-form-item>
                        </a-col>
                        <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                            <a-form-item label="帳號" name="account_number">
                                <a-input v-model:value="data.editForm.account_number" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <a-row>
                    <a-col :xs="24" :sm="24" :md="4" :xl="4" :xxl="4">
                        <a-button size="middle" type="primary" class="submitbtn" @click="send()">
                            送出
                        </a-button>
                    </a-col>
                </a-row>

            </a-card>
        </a-spin>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { CreditCardOutlined } from '@ant-design/icons-vue';
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useLauncherInfoStore } from '../../store/launcher'

import { launcherCreateReview } from '../../api/launcher'

const router = useRouter()
const launcherInfoStore = useLauncherInfoStore()

const data = reactive({
    editForm: {
        bank_name: '', //銀行名稱
        bank_branch: '', //分行名稱
        account_name: '', //帳戶持有人名稱
        account_number: '', //帳號
    },
    rules: {
        bank_name: [{ required: true, message: "請輸入銀行名稱", trigger: "change" }],
        bank_branch: [{ required: true, message: "請輸入分行名稱", trigger: "change" }],
        account_name: [{ required: true, message: "請輸入帳戶持有人名稱", trigger: "change" }],
        account_number: [{ required: true, message: "請輸入帳號", trigger: "change" }],
    },
    spinning: false,
    tip: '檢查中'
})

const editFormRef = ref()
const send = async () => {
    editFormRef.value.validate().then(async () => {
        data.spinning = true
        console.log(launcherInfoStore.ParamInfo.merchant_id, launcherInfoStore.ParamInfo.key)
        //send request
        try {
            const res = await launcherCreateReview(launcherInfoStore.ParamInfo.merchant_id, launcherInfoStore.ParamInfo.key, data.editForm)
            if (res.data.status) {
                launcherInfoStore.SetBankInfo(data.editForm)
                router.replace('/channel')
                data.spinning = false
            }
        } catch (error) {
            console.log(error)
            switch (error.response.status) {
                case 409:
                    message.error('重複審核')
                    break;
                case 404:
                    router.replace('/failed')
                    message.error('訂單失效（過期）')
                    break;
                case 400:
                    message.error('商戶狀態關閉')
                    break;
                case 500:
                    message.error('伺服器錯誤')
                    break;
                default:
                    message.error('錯誤')
                    break;
            }
            // message.error(error)
        } finally {
            data.spinning = false
        }
    })
}

onMounted(() => {
    if (!launcherInfoStore.ParamInfo.merchant_id) {
        message.error('缺少必要參數')
        router.replace('/error')
        return
    }
})

</script>
<script>
export default {
    name: 'cardInfo'
}
</script>

<style lang="scss" scoped>
.submitbtn {
    width: 100%;
}
</style>