// 從Url取得影片網址, 格式: chrome-extension://bmgapikmmjfhaaacgagghjpnhccpihge/html/Player.html?v=[影片網址]&type=[影片類別]
var url = new URL(document.URL);
var url_type = url.searchParams.get("type");
url.searchParams.delete("type");
var url_v = decodeURIComponent(url.search.substr(3));  // 把參數的"?v="忽略掉, 並解碼url

// 載入影片
var player = videojs("player", {
	withCredentials: true,
	controls: true,
	autoplay: true,
	controlBar: {
		children: [
			{ name: "playToggle" }, // 播放按鈕
			{ name: "currentTimeDisplay" }, // 目前播放時間
			{ name: "timeDivider" }, // 目前播放時間
			{ name: "durationDisplay" }, // 總時間
			{ name: "progressControl" }, // 播放進度條
			{ name: "liveDisplay" }, // 播放進度條
			{ // 播放速度
				name: "playbackRateMenuButton",
				"playbackRates": [0.5, 1, 1.25, 1.5, 2]
			},
			{
				name: "volumePanel", // 音量控制
				inline: false, // 不使用水平方式
			},
			{ name: "FullscreenToggle" } // 全螢幕
		]
	},
	sources: [ // 影片來源
		{
			src: url_v,
			type: url_type
		}
	],
	plugins: {
		httpSourceSelector:
		{
			default: "auto"
		}
	}
}, function () {
	console.log("開始播放");
});
// 載入影片畫質選擇功能
player.httpSourceSelector();
// 載入影片播放器快捷鍵
player.ready(function () {
	this.hotkeys({
		volumeStep: 0.1,
		seekStep: 5,
		alwaysCaptureHotkeys: true,
		enableModifiersForNumbers: false
	});
});