import dayjs from 'dayjs'

//文件大小
export const formatSize = (size) => {
    if (size === 0) return '0 B'
    if (!size) return 'NaN';
    const units = ['B', 'KB', 'MB', 'GB'];
    for (const unit of units) {
        if (size < 1024) return `${unit === 'B' ? size : size.toFixed(2)} ${unit}`;
        size /= 1024;
    }
    return `${size.toFixed(2)} GB`;
}

//时间戳转时间
export const formatTime = (timeStamp) => {
    return dayjs(timeStamp).format('YYYY-MM-DD HH:mm');
}

//文件下载速度
export const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s';
    if (!bytesPerSecond) return 'NaN B/s';
    const units = ['B/s', 'KB/s', 'MB/s'];
    let speed = bytesPerSecond;
    for (const unit of units) {
        if (speed < 1024) return `${unit === 'B' ? speed : speed.toFixed(1)} ${unit}`;
        speed /= 1024;
    }
    return `${speed.toFixed(1)} GB/s`;
};
