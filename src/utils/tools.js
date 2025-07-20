function getTimestamp() {
    // 将10位秒级时间戳，前补0，直至满足20位
    return Math.floor(Date.now() / 1000).toString().padStart(20, '0');
}

export {getTimestamp}