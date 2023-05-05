<template>
    <div>
        <!-- <arrow-left-outlined @click="reset()" style="color: blue;" /> -->
        已完成作業
    </div>
</template>

<script setup>
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { reactive } from 'vue';

const router = useRouter()

// const reset = () => {
//     router.replace({
//         path: '/',
//     })
// }

</script>

<style lang="scss" scoped></style>