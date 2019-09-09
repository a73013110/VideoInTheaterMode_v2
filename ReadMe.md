
# Video In Theater Mode Version 2

- This chrome extions completely re-write from [Video In Theater Mode](https://github.com/a73013110/VideoInTheaterMode), so the implementation concept is diferent from all one.

- This version just take aim at the information in devtools and the Url, rather than detecting the HTML code in the page source.

## Current Support Video (Already Test)

### Accourding Video Format

#### HLS video

- m3u8

#### Common video format

- mp4, webm.

### Accourding Video Host

#### Youtube

- *__But__* the video which is restricted to embed doesn't support. (The embed property is set by the person who upload the video)

#### Twitch

- live and video, but I don't want to support *clip*. >_^

#### Dailymotion

#### Vimeo

#### Facebook

- I do my best to make this extension support this site, due to facebook will dynamic get a lot of data when you at it home page which URL is "www.facebook.com/", so I ``disable this extension`` when you at that page. If you want to experience this extension on facebook, please ``click the video to open it, and you will see this extension is enable again``. 

- Furthermore, I use iframe to embed video from facebook and in short I can't get the video size so I develop some interesting features to handle it which one of it is to set all video to 16:9 ratio by default and you need to explore others by yourself.
