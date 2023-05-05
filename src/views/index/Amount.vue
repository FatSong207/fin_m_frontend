<template>
    <div>
        <a-card>
            <template #title>
                {{ data.editForm.channel }}
            </template>
            <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 12 }" :rules="data.rules">
                <a-row>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                        <a-form-item label="金額" name="amount">
                            <a-input v-model:value="data.editForm.amount" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-row>
                <a-col :xs="24" :sm="24" :md="4" :xl="4" :xxl="4">
                    <a-button size="middle" type="primary" style="width: 100%;" @click="send()">
                        送出
                    </a-button>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const route = useRoute()

const data = reactive({
    editForm: {},
    rules: {
        amount: [{ required: true, message: "請輸入金額", trigger: "change" }],
    },
})

onMounted(() => {
    // console.log(route, route.params)
    data.editForm.channel = route.params.id
})

const send = () => {
    console.log(data.editForm)//send request
    message.success('已送出！')
}
</script>

<style lang="scss" scoped></style>