export function generateCode(length=4) {
    const key = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = '';
    for (let i = 0; i < length; i++) {
        code += key[Math.floor(Math.random() * key.length)];
    }
    return code;
}
