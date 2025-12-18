const GATEWAY_SERVER = 'http://localhost:10000';
const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: GATEWAY_SERVER,
    }
})
