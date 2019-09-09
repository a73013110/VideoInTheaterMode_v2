window.onload = function () {
    // get m3u8 urls for current active tab
    window.bg_wnd = chrome.extension.getBackgroundPage();   // 取得background.html
    var urls = window.bg_wnd.bg.GetUrl();   // 使用background.html中background.js的get_urls()方法

    // function render m3u8 urls list
    render_urls(urls);
};

function render_urls(urls) {
    var content = document.getElementById('content');

    if (!urls || !urls.length) {
        content.innerHTML = '<h5 class="not-found">未發現影片, 請播放影片後再試</h5>';
        return;
    }
    var tr = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];    
        var _url = new URL(url);
        if (_url.searchParams.get("v")) // 若是取得影片片源(Ex: mp4, m3u8), 直接將title設為檔名
            tr.push('<tr><td class="content"><div align="center"><a class="video" title="' + _url.searchParams.get("v").split("?")[0].split("/").pop() + '" href="' + url + '">影片 ' + (i+1) + '</a></div></td></tr>');
        else
            tr.push('<tr><td class="content"><div align="center"><a class="video" title="' + url + '" href="' + url + '">影片 ' + (i+1) + '</a></div></td></tr>');
    }
    var title = '<h5 class="found">發現 ' + urls.length + ' 個片源</h5>';
    content.innerHTML = '<table><tr><td>' + title + '</td></tr></table>' +
                        '<table class="content">' + tr.join('') + '</table>';

    var m3u8 = content.querySelectorAll('a.video');
    for (i = 0; i < m3u8.length; i++) {
        m3u8[i].addEventListener('click', function (event) {
            var href = this.href;   // 取得按鈕的連結
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                chrome.tabs.update(tabs[0].id, {url: href});    // 將網頁導向該連結
                window.close(); // 關閉popup視窗
            });
            event.preventDefault();
            return (false);
        });
    }
}