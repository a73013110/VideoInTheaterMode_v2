importScripts("./plugins/video.js");
importScripts("./plugins/youtube.js");
importScripts("./plugins/facebook.js");
importScripts("./plugins/vimeo.js");
importScripts("./common/functions.js");

/* work object */
var bgObj = function () { };

/* Public methods */
bgObj.prototype = {
    tabs: {},   // 儲存: urls
    active_tab: {}, // 紀錄Active Tab

    CheckTabsUrls: function(tabId) {
        if (!this.tabs[tabId]) this.tabs[tabId] = { urls: [] };
        else if (!this.tabs[tabId].urls) this.tabs[tabId].urls = [];
    },
    SetTab: function (tabId) {
        this.tabs[tabId] = { urls: [] }
        this.SetUrlCount(tabId); // 計算目前urls數量並顯示
    },
    RemoveTab: function (tabId) {
        delete this.tabs[tabId];    // 刪除這個tab的資料
    },
    SaveUrl: function (tabId, url) {
        this.CheckTabsUrls(tabId);
        if (this.tabs[tabId].urls.indexOf(url) === -1) { // 若是新的m3u8
            this.tabs[tabId].urls.push(url); // 記錄
            this.SetUrlCount(tabId); // 計算目前urls數量並顯示
        }
    },
    SetUrlCount: function (tabId) {
        if (this.tabs[tabId] && this.tabs[tabId].urls) {
            if (this.tabs[tabId].urls.length != 0) {    // 若數量不為0
                chrome.action.setBadgeText({ text: this.tabs[tabId].urls.length.toString() }); // 設置m3u8數量
                return (0);
            }
        }        
        chrome.action.setBadgeText({ text: '' });    // 預設值
    },    
    onActivated: function (tab) {
        this.active_tab = tab;  // 紀錄目前Activate的tab
        this.SetUrlCount(tab.tabId); // 計算目前urls數量並顯示
    },

    /* Function will be called from m3u8.js */
    GetUrl: function () {
        if (!this.tabs[this.active_tab.tabId]) {
            this.tabs[this.active_tab.tabId] = { urls: [] };  // 初始化urls
        }
        return (this.tabs[this.active_tab.tabId].urls);
    }
};

var bg = new bgObj();    // 創建bgObj功能物件
// 取得所有webRequest的結果 
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length == 0) return;   // 過濾錯誤資訊
        // 過濾特定網站的Request, page_url.hostname: 整個網域, page_url.href: 指定網站
        var page_url = new URL(tabs[0].url);
        if (page_url.protocol == "chrome-extension:" || page_url == undefined || 
            page_url.hostname == "www.youtube.com" || page_url.hostname == "www.facebook.com") return

        // 開始監聽
        var url = null;
        /* 於此數添加監聽Devtools Network資料的Plugin, 重要: 先執行特定網址的Plugin => 最後再使用預設的function: GetVideoFromNetwork() */ 
        GetUrlFromNetwork: {
            url = GetYoutubeUrlFromNetwork(details);
            if (url) break GetUrlFromNetwork;
            url = GetVimeoUrlFromNetwork(details);
            if (url) break GetUrlFromNetwork;
            url = GetVideoFromNetwork(details);
        }

        if (url != null) bg.SaveUrl( details.tabId, url );   // 若有影片網址, 儲存起來
    });
}, { urls: ["<all_urls>"] });

// 切換目前tab的事件
chrome.tabs.onActivated.addListener(function (info) {
    bg.onActivated(info);
});

// set handler to tabs
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    // Disalbe此插件的狀況
    if (!id || !tab || !tab.url || ((tab.url.indexOf("http:") === -1) && (tab.url.indexOf("https:") === -1))) {
        if (id) {
            chrome.action.disable(id);
        }
        return (0);
    }

    if (info && info.status && (info.status.toLowerCase() === "loading")) {            
        chrome.action.enable(id);
        bg.SetTab(id);   // 儲存tab資訊
    }
    else if (info && info.status && (info.status.toLowerCase() === "complete")) {
        chrome.action.enable(id);
        var url = null;
        /* 於此數添加網頁載入完成後的Plugin */
        GetUrlFromUrl: {
            url = GetYoutubeUrlFromUrl(tab);
            if (url) break GetUrlFromUrl;
            url = GetFacebookUrlFromUrl(tab);
            if (url) break GetUrlFromUrl;
            url = GetVimeoUrlFromUrl(tab);
        }

        if (url != null) bg.SaveUrl( id, url );   // 若有影片網址, 儲存起來
    }
});

// 關閉tab時, 也刪除該tab的資料
chrome.tabs.onRemoved.addListener(function (id, info) {
    bg.RemoveTab(id);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.target === "service-worker") {
        if (request.typr === "getUrl") {
            sendResponse(bg.GetUrl());
        }
    }
});

// 安裝事件
chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {   // 首次安裝
        // if(confirm(getMessage("update"))) {
        //     chrome.tabs.create({ url: "https://chrome.google.com/webstore/detail/bglicehingnhimmkihplligdihgfapjf" });
        // }
        // alert(getMessage("first_install"));
    }
    else if(details.reason == "update"){    // 更新
        // if(confirm(getMessage("update"))) {
        //     chrome.tabs.create({ url: "https://chrome.google.com/webstore/detail/bglicehingnhimmkihplligdihgfapjf" });
        // }
    }
});
