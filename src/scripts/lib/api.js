import axios from "axios";

export default async function callApi (method,url,data,cb) {
    let option = {
        method : method,
        url : `${window.location.protocol}//127.0.0.1/api/${url}`,
        withCredentials: true,
        responseType : url.indexOf("excel") > -1 ? "blob" : "json",
    };
    if( data ) 
        option.data = data;    
    axios(option).then((result) => {
        cb && cb({ result : result, msg : "OK"});
    }).catch((error) => {
        cb && cb({ result : error, msg : "ERROR"});
    });
}