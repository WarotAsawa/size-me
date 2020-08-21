export function EncryptObject(data, key) {
    var CryptoJS = require("crypto-js");
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return ciphertext;
}
export function DecryptObject(ciphertext, key) {
    const error = {'err':'N/A'}
    var isSuccess = true;
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    var string;
    var decryptedObj;
    try {
        string = bytes.toString(CryptoJS.enc.Utf8);
    } catch(err) {
        return error;
    }
    try { 
        decryptedObj = JSON.parse(string);
    } catch (err) {
        isSuccess = false;
        return error;
    }
    if (isSuccess) return decryptedObj;
    else return error;
}
