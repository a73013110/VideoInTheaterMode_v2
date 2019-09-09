var player_width = null;
var new_player_width = null;
var ratio = 16/9;   // 預設將影片以16:9顯示

window.onload = function() {
    var url = new URL(document.URL);
    document.getElementById("player").src = "https://www.facebook.com/plugins/video.php?href=" + url.searchParams.get("v") + "&autoplay=1&mute=0";
    window.setTimeout( (() => HideControlBar()) , 2000);   // 自動隱藏控制條
    SetPlayerSize();    // 初始化播放器大小
    player_width = $("#player").width();

    /* Slider Bar */
    $("#Slider").slider({reversed:true}).on("change", function(event) {
        var scale = 1;
        if (event.value.newValue >= 0) scale += event.value.newValue*10;
        else scale += event.value.newValue;
        new_player_width = player_width * scale;
        ratio = new_player_width / window.innerHeight;
        document.getElementById("player").width = new_player_width;
    });
    $("#control").on("mouseenter", function() {        
        ShowControlBar();
    });
    $("#control").on("mouseleave", function() {
        HideControlBar()
    });
    $("#Btn_ShowAndHide").on("click", function() {
        // 顯示控制條
        if ($("#Btn_ShowAndHide").css("background-image").indexOf("show") >= 0) {
            ShowControlBar();
        }
        else { // 隱藏控制條
            HideControlBar()
        }        
    });

    // 切換影片顯示的解析度比例
    $("#Btn_Swap").on("click", function() {
        if (ratio == 16/9) ratio = 9/16;
        else ratio = 16/9;
        SetPlayerSize();
    });
}

window.onresize = function(event) {
    SetPlayerSize();
};

function ShowControlBar() {
    $("#Btn_ShowAndHide").css("background-image", "url('../images/hide.png')")
    $("#controlBar").fadeIn(200);
    $("#control").css("background", "rgba(0, 0, 0, 0.6)");
}

function HideControlBar() {
    $("#Btn_ShowAndHide").css("background-image", "url('../images/show.png')")
    $("#controlBar").fadeOut(200);
    $("#control").css("background", "none");
}

function SetPlayerSize() {
    var player = document.getElementById("player");
    var document_height = window.innerHeight;
    var document_width = window.innerWidth;
    if (new_player_width) {    // 若有手動調整影片大小
        var player_height = player.height;
        var player_width = new_player_width;
    }
    else {  // 無調整影片大小, 預設用16:9的方式調整影片
        var player_height = 9;
        var player_width = 16;
    }
    
    if (document_width / document_height >= player_width / player_height) { // 畫面較寬, 影片較窄, 左右黑邊
        // var original_player_height = player.height;
        player.height = document_height;
        player.width = player.height * ratio;
        
        player.style.transform = null;
    }
    else {  // 畫面較窄, 影片較寬, 上下黑邊
        player.width = document_width;
        player.height = player.width * player_height / player_width;
        player.style.transform = "translateY(" + ((document_height - player.height) / 2).toString() + "px)"
    }
    
    // 計算控制條的高度
    var slider = document.getElementById("resizeSlider");
    slider.style.height = document_height - 160 + "px";
}