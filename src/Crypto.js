export function EncryptObject(data, key) {
    var CryptoJS = require("crypto-js");
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return ciphertext;
}
export function DecryptObject(ciphertext, key) {
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    var decryptedObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedObj;
}
