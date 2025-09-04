function getTimestamp() {
    // 将10位秒级时间戳，前补0，直至满足20位
    return Math.floor(Date.now() / 1000).toString().padStart(20, '0');
}

// 简单防抖函数：默认300ms
function debounce(fn, wait = 300) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            // 保持 this 语义与参数
            fn.apply(this, args);
        }, wait);
    };
}

export {getTimestamp, debounce}