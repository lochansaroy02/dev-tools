import CryptoJS from "crypto-js";

export type HashType = "MD5" | "SHA-1" | "SHA-256" | "SHA-512" | "SHA-3" | "Base64";

export const generateHash = (text: string, type: HashType): string => {
    if (!text) return "";

    switch (type) {
        case "MD5":
            return CryptoJS.MD5(text).toString();
        case "SHA-1":
            return CryptoJS.SHA1(text).toString();
        case "SHA-256":
            return CryptoJS.SHA256(text).toString();
        case "SHA-512":
            return CryptoJS.SHA512(text).toString();
        case "SHA-3":
            return CryptoJS.SHA3(text).toString();
        case "Base64":
            return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
        default:
            return "";
    }
};