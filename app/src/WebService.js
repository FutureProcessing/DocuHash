import config from './config'
import WebServiceErrorStatusesEnum from './WebServiceErrorStatusesEnum'

class ipfsFile {
    constructor(hash, time, exists, url) {
        this.hash = hash;
        this.time = time;
        this.exists = exists;
        this.url = url;
    }
}

class WebService {
    async getFileAsync(hash) {
        var response = await fetch(`${config.apiServerAddress}/getfile?hash=${hash}`, {
            method: 'GET',
            headers: { 'Accept': 'text/plain', 'Content-Type': 'text/plain' }
        });

        if (response.status === 200) {
            var fileInfo = await response.json();
            return new ipfsFile(fileInfo.hash, new Date(fileInfo.unixTimeAdded * 1000).toString(), fileInfo.exists, fileInfo.url);
        }
        else if(response.status === 404) {
            return WebServiceErrorStatusesEnum.FileNotExist;
        }
        else {
            console.log('hash: '+ hash +' status: ' + response.status);
            return WebServiceErrorStatusesEnum.DifferentGetError;
        }
    }

    async addFileAsync(file) {
            var response = await fetch(`${config.apiServerAddress}/addfile`, {
                method: 'POST',
                headers: { 'Accept': 'application/octet-stream', 'Content-Type': 'application/octet-stream' },
                body: file
            });
    
            if (response.status === 200) {
                var json = await response.json();
                return json;
            }
            else if(response.status === 409) {
                return WebServiceErrorStatusesEnum.FileAlreadyExists;
            }
            else {
                return WebServiceErrorStatusesEnum.DifferentAddError;
            }
    }
}

export default WebService;
export { ipfsFile };