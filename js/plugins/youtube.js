/* 從Devtools Networks取得youtube影片 */
function GetYoutubeUrlFromNetwork(details) {    
    if (details.url.indexOf("www.youtube.com/embed") >= 0) { // 這方法就可以偵測到内嵌youtube影片的網址
        if (details.url.split("?")[0].split("/").pop()) {   // 若有找到影片ID
            var url = new URL(details.url);
            if (url.search) return details.url + "&autoplay=1";
            else return details.url + "?autoplay=1";
        }        
    }
}

/* 若瀏覽youtube時 */
function GetYoutubeUrlFromUrl(tab) {
    var url = new URL(tab.url);
    if (url.hostname == "www.youtube.com") {   // 若為youtube網域
        var id = url.searchParams.get("v")  // 取得影片ID
        if (id == null) return null;    // 若沒有影片id參數, 回傳null
        url.searchParams.delete("v");   // 刪除影片ID的參數
        if (url.search) return "https://www.youtube.com/embed/" + id + url.search + "&autoplay=1";  // 若還有參數
        else return "https://www.youtube.com/embed/" + id + "?autoplay=1";  // 若沒有參數
    }
}