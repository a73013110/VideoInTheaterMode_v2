/* 從Devtools Networks取得Vimeo影片 */
function GetVimeoUrlFromNetwork(details) {
    if (details.url.indexOf("player.vimeo.com/video") >= 0) { // 這方法就可以偵測到内嵌Vimeo影片的網址
        var url = details.url.split("?")[0];
        url = url.substr(0, url.lastIndexOf("/"));
        return url + "?transparent=false";
    }
}

/* 若瀏覽Vimeo時 */
function GetVimeoUrlFromUrl(tab) {
    var url = new URL(tab.url);
    if (url.hostname == "vimeo.com") {   // 若為Vimeo網域
        var id = tab.url.split("/").pop();
        if (isNaN(parseInt(id))) return null;   // 錯誤的id
        return "https://player.vimeo.com/video/" + id + "?transparent=false";  // 若沒有參數
    }
}