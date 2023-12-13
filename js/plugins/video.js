/* 通用的影片偵測 */
function GetVideoFromNetwork(details) {    
    // 取得副檔名
    var extension = details.url.split('?')[ 0 ].split('.').pop().toLowerCase();
    
    // 各種格式影片
    if (extension === "m3u8") {
        return chrome.runtime.getURL("html/Player.html") + "?v=" + details.url + "&type=application/x-mpegURL";
    }
    else if (extension === "mp4") {    
        var url = new URL(details.url);
        if (url.searchParams.get("bytestart") && url.searchParams.get("byteend")) {
            url.searchParams.delete("bytestart");
            url.searchParams.delete("byteend");
            return url.href;
        }    
        return chrome.runtime.getURL("html/Player.html") + "?v=" + details.url + "&type=video/mp4";
    }
    else if (extension === "webm") {
        var url = new URL(details.url);
        if (url.searchParams.get("bytestart") && url.searchParams.get("byteend")) {
            url.searchParams.delete("bytestart");
            url.searchParams.delete("byteend");
            return url.href;
        }
        return chrome.runtime.getURL("html/Player.html") + "?v=" + details.url + "&type=video/webm";
    }
}
