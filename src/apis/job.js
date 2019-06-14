import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';
import * as middleware from './middleware';


class JobApi {
    static getList = async (filters={}) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'jobs',{
                method: "GET",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static get = async (_id) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            let url = CONFIG.apiUrl  + 'job/' + _id;
            const res = await fetch(url ,{
                method: "GET",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static getJobToken = async (_id) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            let url = CONFIG.apiUrl  + 'job/' + _id + "/token";
            const res = await fetch(url ,{
                method: "GET",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static createLocal = async(data) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const jsonData = JSON.stringify(data);
            const res = await fetch(CONFIG.apiUrl  + 'job/local', {
                method: "POST",
                body: jsonData,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static createRemote = async(formData) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            console.log(formData.get("name"));
            console.log(formData.get("train_src"));
            const res = await fetch(CONFIG.apiUrl  + 'job/remote', {
                method: "POST",
                body: formData,
                headers: new Headers({
                    'Authorization': token,
                })
            });
            console.log(res);
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static delete = async(jobId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'job/' + jobId, {
                method: "DELETE",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static downloadModel = async(trainingId, epoch, batch) => {
        const token = "Bearer " + authUtil.getToken();
        const url = CONFIG.apiUrl  + 'training/' + trainingId + "/download/" + epoch + "/" + batch;

        // streamSaver source code is in public/dependencies/StreamSaver.js
        const fileStream = window.streamSaver.createWriteStream(trainingId + "_" + epoch + "_" + batch + ".h5");
        
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers({
                'Authorization': token,
            }),
        });
        const readableStream = res.body;
        console.log(res);

        // more optimized
        if (window.WritableStream && readableStream.pipeTo) {
            return readableStream.pipeTo(fileStream).then(() => console.log('done writing'));
        }

        window.writer = fileStream.getWriter();

        const reader = res.body.getReader();
        const pump = () => reader.read()
            .then(res => res.done
            ? window.writer.close()
            : window.writer.write(res.value).then(pump));

        pump();
    }
}

export default JobApi;