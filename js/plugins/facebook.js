/* 從Devtools Networks取得Facebook影片 */
// function GetFacebookUrlFromNetwork(details) {
//     if (details.url.indexOf("www.youtube.com/embed") >= 0) { // 這方法就可以偵測到内嵌youtube影片的網址
//         var url = new URL(details.url);
//         if (url.search) return details.url + "&autoplay=1";
//         else return details.url + "?autoplay=1";
//     }
// }

/* 若瀏覽facebook時 */
function GetFacebookUrlFromUrl(tab) {
    var url = new URL(tab.url);
    if (url.hostname == "www.facebook.com") {   // 若為facebook網域
        var id = null;
        if (url.pathname.indexOf("watch") >= 0) {
            id = url.searchParams.get("v")  // 取得影片ID
        }
        else if (url.pathname.indexOf("videos") >= 0) {
            var tmp = url.pathname.split("/");
            id = tmp[tmp.indexOf("videos")+1];
        }
        if (isNaN(parseInt(id))) return null;    // 若沒有影片id參數, 回傳null
        return chrome.runtime.getURL("html/FacebookPlayer.html") + "?v=https://www.facebook.com/watch/?v=" + id;
    }
}