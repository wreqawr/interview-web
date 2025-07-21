import http from './http';
import {LOGIN_URL, REGISTER_URL, GET_PUB_KEY_URL} from './endpoints';
import forge from "node-forge";


export async function getPublicKey() {
    const {data} = await http.get(GET_PUB_KEY_URL);
    return data.publicKey;
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
        LOGIN_URL,
        loginPayload,
        {
            headers: {
                captchaId
            }
        }
    );
}

export async function register(registerPayload) {
    const {data} = await http.post(REGISTER_URL, {registerPayload});
    return data;
} 