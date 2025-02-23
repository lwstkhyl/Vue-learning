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

//时间戳转时间（年月日时分）
export const formatTime = (timeStamp) => {
    return dayjs(timeStamp).format('YYYY-MM-DD HH:mm');
}

//秒数转时间（时分秒）
export const formatTime_hms = (s) => {
    if (s === 0) return '00:00:00';
    if (!s) return "-";
    const hour = parseInt(s / 3600);
    const minute = parseInt((s - hour * 3600) / 60);
    const second = parseInt(s - hour * 3600 - minute * 60);
    return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
}

//文件下载速度
export const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s';
    if (!bytesPerSecond) return '-';
    const units = ['B/s', 'KB/s', 'MB/s'];
    let speed = bytesPerSecond;
    for (const unit of units) {
        if (speed < 1024) return `${unit === 'B' ? speed : speed.toFixed(1)} ${unit}`;
        speed /= 1024;
    }
    return `${speed.toFixed(1)} GB/s`;
};
