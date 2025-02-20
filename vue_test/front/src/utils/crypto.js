import md5 from 'md5';

export const encryptPassword = pwd => md5(pwd);
export const encodeFileName = (name) => {
    return encodeURIComponent(name)
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
};