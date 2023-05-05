<template>
    <div>
        <a-spin :spinning="data.spinning" tip="檢查中">
            <div style="height:60px"></div>
        </a-spin>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { useLauncherInfoStore } from '../../store/launcher';

import { launcherGetTransaction } from '../../api/launcher'

const emit = defineEmits(["emitInfo"]);

const router = useRouter()
const route = useRoute()
const launcherInfoStore = useLauncherInfoStore()

const data = reactive({
    spinning: false
})

onMounted(async () => {
    if (!route.params) {
        message.error('param invalid')
    }
    data.spinning = true

    //send request
    try {
        let merchant_id = route.params.launcher
        let key = route.params.key
        const res = await launcherGetTransaction(merchant_id, key)
        let s = {
            merchant_id: merchant_id,
            key: key,
            expire_at: res.data.data.expire_at,
            type: res.data.data.type
        }
        //設置pinia
        launcherInfoStore.SetParamInfo(s)
        //emit至Index
        emit("emitInfo", s)
        if (res.data.status) {
            router.replace({
                name: 'cardInfo',
            })
        }
    } catch (error) {
        switch (error.response.status) {
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
    } finally {
        data.spinning = false
    }
})

</script>

<style lang="scss" scoped></style>