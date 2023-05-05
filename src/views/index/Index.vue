<template>
    <div class="container">
        <div class="header">
            <span class="title">
                <!-- <MoneyCollectOutlined :rotate="data.title === '入款' ? 0 : 180" />  -->
                {{ data.title }}
            </span>
        </div>
        <a-card v-if="data.key" style="width: 100%;">
            <template #title>
                <ContainerOutlined /> 訂單資訊
            </template>
            <template #extra>
                <a @click="getInfo()">
                    <ExclamationCircleOutlined />
                </a>
            </template>
            <a-row>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                    編號：{{ data.key }}
                </a-col>
                <a-col :xs="24" :sm="24" :xl="8" :xxl="6">
                    到期：{{ data.expire_at ? moment(data.expire_at).format('YYYY-MM-DD HH:mm:ss') : '' }}
                </a-col>
            </a-row>
        </a-card>
        <div class="content">
            <div class="main">
                <router-view v-slot="{ Component }">
                    <transition name="fade-transform" mode="out-in">
                        <keep-alive include="cardInfo">
                            <component :is="Component" @emitInfo="emitInfo" />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
            <div class="footer">
                <div class="copyright">Copyright © 2023 GSH</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { ContainerOutlined, MoneyCollectOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import moment from 'moment'
import { message } from 'ant-design-vue';

const data = reactive({
    title: '',
    key: '',
    expire_at: '',
})

onMounted(() => {
})

const emitInfo = (s) => {
    data.title = s.type === 1 ? '入款' : s.type === 2 ? '出款' : ''
    data.key = s.key
    data.expire_at = s.expire_at
}

const getInfo = () => {
    message.info('info')
}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    background: #F0F2F5;
}

.header {
    width: 100%;
    height: 10%;
    display: flex;
    background: #F0F2F5;
}

.content {
    width: 100%;
    margin-top: 10px;
}

.main {
    width: 90%;
    margin: 0 auto;
}

.footer {
    width: 100%;
    bottom: 0;
    text-align: center;
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
}

.copyright {
    padding: 10px;
}

.title {
    font-size: 22px;
    color: rgba(31, 31, 31, 0.85);
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
    padding: 20px;
    letter-spacing: 1px;
}
</style>
