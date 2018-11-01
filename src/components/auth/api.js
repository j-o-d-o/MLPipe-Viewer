import { CONFIG } from 'config';


class AuthApi {
    static login(credentials) {
        let data = JSON.stringify(credentials);
        return fetch(CONFIG.apiUrl  + 'user/login',{
            method: "POST",
            body: data,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res =>
            res.json().then(json => ({
                status: res.status,
                json
            }))
        )
        .then(res => {
            return res;
        }).catch(error => {
            return error;
        });
    }
}

export default AuthApi;