<template>
    <div>
        <!-- <arrow-left-outlined @click="reset()" style="color: blue;" /> -->
        <a-spin :spinning="data.cardSpinning" :tip="data.cardTip">
            <a-card v-if="!data.resBankInfo.account_name">
                <template #title>
                    <PartitionOutlined /> 選擇通道
                </template>
                <template #extra>
                </template>
                <a-row :gutter="12">
                    <a-col v-for="item in data.list" :key="item.index" :xs="12" :sm="12" :md="6" :xl="6" :xxl="6">
                        <a-card hoverable style="margin-bottom: 10px;" @click="send(item)">
                            <!-- <template #cover>
                                <img class="card-item" alt="Oops..." :src="getImageUrl(item.src)" />
                            </template>
                            <template #actions>
                                <a-button type="primary" @click="send(item)">選擇</a-button>
                            </template> -->
                            <a-card-meta>
                                <template #title>
                                    <span v-if="item[0] === '1'">
                                        <CreditCardOutlined />
                                    </span>
                                    <span v-else-if="item[0] === '2'">
                                        <AlipayCircleOutlined />
                                    </span>
                                    <span v-else>
                                        <PayCircleOutlined />
                                    </span>
                                    {{ item[1] }}
                                </template>
                            </a-card-meta>
                        </a-card>
                    </a-col>
                </a-row>
            </a-card>
            <a-card v-if="data.resBankInfo.account_name">
                <template #title>
                    <BankOutlined /> 收款帳號資訊
                </template>
                <a-descriptions bordered :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
                    <a-descriptions-item label="帳號名稱">{{ data.resBankInfo.account_name }}</a-descriptions-item>
                    <a-descriptions-item label="帳號">{{ data.resBankInfo.account_number }}</a-descriptions-item>
                    <a-descriptions-item label="銀行名稱">{{ data.resBankInfo.bank_name }}</a-descriptions-item>
                    <a-descriptions-item label="分行名稱">{{ data.resBankInfo.bank_branch }}</a-descriptions-item>
                </a-descriptions>
            </a-card>
        </a-spin>
        <!-- <a-modal v-model:visible="data.modalVisible" :title="data.modalTitle" :maskClosable="false" :keyboard="false"
            :closable="false" @ok="onSave" @cancel="onCancel" cancelText="取消" okText="確認" width="90%"
            style="max-width: 400px;">
            <a-spin :spinning="data.spinning">
                <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                    :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 12 }" :rules="data.rules">
                    <a-row>
                        <a-col :xs="24" :sm="24" :xl="4" :xxl="4">
                            <a-form-item label="金額" name="amount">
                                <a-input v-model:value="data.editForm.amount" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-spin>
        </a-modal> -->
    </div>
</template>

<script setup>
import { Modal, message } from 'ant-design-vue';
import { PartitionOutlined, BankOutlined, CreditCardOutlined, PayCircleOutlined, AlipayCircleOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue';
import { useLauncherInfoStore } from '../../store/launcher'

import { launcherGetReview, launcherSetTransactionPayment, launcherGetTransactionDepositPayment } from '../../api/launcher'

const router = useRouter()
const launcherInfoStore = useLauncherInfoStore()

onMounted(async () => {
    if (!launcherInfoStore.ParamInfo.merchant_id) {
        message.error('缺少必要參數')
        router.replace('/error')
        return
    }
    await tyrGetChannels()
})

const data = reactive({
    resBankInfo: {
        account_name: '',
        account_number: '',
        bank_branch: '',
        bank_name: '',
    },
    editForm: {
        amount: ''
    },
    rules: {
        amount: [{ required: true, message: "請輸入金額", trigger: "change" }],
    },
    list: [],
    modalVisible: false,
    cardSpinning: true,
    spinning: false,
    modalTitle: '',
    cardTip: '獲取通道中'
})

const tyrGetChannels = async () => {
    var interval = setInterval(async () => {
        try {
            let res = await launcherGetReview(launcherInfoStore.ParamInfo.merchant_id, launcherInfoStore.ParamInfo.key)
            console.log('launcherGetReview', res)

            switch (res.data.data.status) {
                case 1: //待審核 繼續請求
                    break;
                case 2: //表示已有通道可選(payment_channels)
                    let slist = res.data.data.payment_channels
                    data.list = Object.entries(slist);
                    data.cardSpinning = false
                    console.log(data.list)
                    clearInterval(interval)
                    break;
                case 6: //審核失敗
                    clearInterval(interval)
                    break;
                case 7: //訂單過期
                    message.error('訂單過期')
                    clearInterval(interval)
                    break;
            }

        } catch (error) {
            clearInterval(interval)
            switch (error.response.status) {
                case 404:
                    router.replace('/failed')
                    message.error('訂單失效（過期）')
                    break;
                case 400:
                    message.error('商戶狀態關閉或訂單類型錯誤')
                    break;
                case 500:
                    message.error('伺服器錯誤')
                    break;
                default:
                    message.error('錯誤')
                    break;
            }
        }

    }, 3000);
}

/**
 * 靜態檔案
 * @param {string 檔案名稱} name 
 */
const getImageUrl = (name) => {
    return new URL(`../../assets/${name}`, import.meta.url).href
}

/**
 * 返回
 */
const reset = () => {
    router.replace({
        path: '/cardInfo',
    })
}

const send = (item) => {
    console.log(item)
    Modal.confirm({
        title: '確認',
        content: `確定選擇${item[1]}？`,
        okText: '確認',
        cancelText: '取消',
        onOk: () => {
            payment(item)
        },
    })
}

const payment = async (item) => {
    let dataf = launcherInfoStore.BankInfo
    dataf.payment_channel_id = parseInt(item[0])
    // console.log(dataf)
    try {
        data.cardTip = "獲取資訊中"
        data.cardSpinning = true
        const res = await launcherSetTransactionPayment(launcherInfoStore.ParamInfo.merchant_id, launcherInfoStore.ParamInfo.key, dataf);
        // console.log(res)

        // RULE:訂單為入款需看response body內容, 出款如果沒回覆錯誤可返回畫面
        // 出款
        if (launcherInfoStore.ParamInfo.type === 2) {
            router.replace({
                name: 'final'
            })
            //入款
        } else if (launcherInfoStore.ParamInfo.type === 1) {
            data.cardTip = "獲取資訊中"
            data.cardSpinning = true
            if (res.data.data.redirect) {
                //跳轉至指定url
                try {
                    window.location.replace(res.data.data.redirect)
                } catch (error) {
                    console.log(error)
                }
            } else {
                let i = setInterval(async () => {
                    try {
                        const res = await launcherGetTransactionDepositPayment(launcherInfoStore.ParamInfo.merchant_id, launcherInfoStore.ParamInfo.key);
                        // console.log(res)
                        if (res.data.data.status) {
                            // 收款帳號資訊
                            const res2 = res.data.data
                            data.resBankInfo.account_name = res2.account_name
                            data.resBankInfo.account_number = res2.account_number
                            data.resBankInfo.bank_branch = res2.bank_branch
                            data.resBankInfo.bank_name = res2.bank_name

                            clearInterval(i)
                            data.cardTip = "獲取通道中"
                            data.cardSpinning = false
                        }
                    } catch (error) {
                        clearInterval(i)
                        data.cardTip = "獲取通道中"
                        data.cardSpinning = false
                        switch (error.response.status) {
                            case 404:
                                router.replace('/failed')
                                message.error('訂單失效（過期）')
                                break;
                            case 400:
                                message.error('非入款訂單或非交易員處理的訂單')
                                break;
                            case 500:
                                message.error('伺服器錯誤')
                                break;
                            default:
                                message.error('錯誤')
                                break;
                        }
                    } finally {
                    }
                }, 5000);
            }
        }
    } catch (error) {
        switch (error.response.status) {
            case 404:
                router.replace('/failed')
                message.error('訂單失效（過期）')
                break;
            case 400:
                message.error('非入款訂單或非交易員處理的訂單')
                break;
            case 500:
                message.error('伺服器錯誤')
                break;
            default:
                message.error('錯誤')
                break;
        }
    } finally {
    }
}

// const onSave = () => {
//     data.spinning = true
//     var r = Math.floor(Math.random() * 2);// 0 or 1
//     const res = r === 1

//     if (res) {
//         router.replace({
//             name: 'final'
//         })
//     } else {
//         message.error('錯誤')
//         data.spinning = false
//     }
// }

// const onCancel = () => {
//     data.editForm.amount = ''
// }

</script>

<style lang="scss" scoped>
.card-item {
    width: 100%;
    height: auto;
    // max-height: 160px;
}
</style>