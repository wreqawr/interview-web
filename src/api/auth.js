import http from './http';
import {USER_LOGIN_URL, USER_PUB_KEY_URL, USER_REGISTER_URL} from './endpoints';
import forge from "node-forge";


export async function getPublicKey() {
    const {data} = await http.get(USER_PUB_KEY_URL);
    return data.data; // 直接返回公钥字符串
}

export function encryptPassword(publicKeyPem, password) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    return forge.util.encode64(
        publicKey.encrypt(password, "RSA-OAEP", {
            md: forge.md.sha256.create(),
        })
    );
}

export async function login(loginPayload, captchaId) {
    return await http.post(
        USER_LOGIN_URL,
        loginPayload,
        {
            headers: {
                captchaId
            }
        }
    );
}

export async function register(registerPayload, captchaId) {
    const {data} = await http.post(
        USER_REGISTER_URL,
        registerPayload,
        {
            headers: {
                captchaId
            }
        }
    );
    return data;
}
