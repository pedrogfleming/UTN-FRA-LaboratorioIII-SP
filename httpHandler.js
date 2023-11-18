import { toObjs } from "./persona.js"

export class HttpHandler {
    constructor() {
        if (!this.XMLHttpRequest) {
            this.XMLHttpRequest = new XMLHttpRequest();
            this.XMLHttpRequest.addEventListener("progress", updateProgress);
            this.XMLHttpRequest.addEventListener("load", transferComplete);
            this.XMLHttpRequest.addEventListener("error", transferFailed);
            this.XMLHttpRequest.addEventListener("abort", transferCanceled);
        }
    }

    sendGetSync() {
        this.XMLHttpRequest.open("GET", GetUrl(), false);
        this.XMLHttpRequest.send();
        if (this.XMLHttpRequest.status === 200) {
            const jsonString = this.XMLHttpRequest.responseText;
            const jsonArray = JSON.parse(jsonString);
            const entidades = toObjs(jsonArray);
            return entidades;
        }
        else {
            console.log("error on sending request to the server: " + this.XMLHttpRequest.status);
            throw new Error("Server error: " + this.XMLHttpRequest.status);
        }
    }

    async sendPutAsync(obj) {
        return await fetch(GetUrl(), {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, 
            //same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        });
    }

    sendPost(obj){
        return new Promise((resolve, reject) =>{
            fetch(GetUrl(), {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(obj)
            })
            .then(response => {
                if(response.ok){
                    resolve(response);
                }else{
                    response.text().then(errorMessage => {
                        reject(new Error('Error ' + response.status + ': ' + errorMessage));
                    });
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }
    
    async sendDeleteAsync(obj){
        return await fetch(GetUrl(), {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, 
            //same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(obj)
        });
    }


    // progress on transfers from the server to the client (downloads)
}
function GetUrl() {
    return "http://localhost/personasFutbolitasProfesionales.php";
}
function updateProgress(event) {
    if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log("Compute progress: " + percentComplete);
    } else {
        // Unable to compute progress information since the total size is unknown
        console.log("Unable to compute progress information since the total size is unknown");
    }
}
function transferComplete(evt) {
    console.log("The transfer is complete.");
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
}