Surfline upgraded to HTML5 player using JWPlayer:

on line 4623:

            if(responseData.streamInfo.stream[0] && incompatible == false && streamStatus == true){
                adTag = "http://oascentral.surfline.com/RealMedia/ads/adstream_sx.ads/"+sitepage+"@x45?keyword="+userType;
                cameraStream = data.file

data.file = http://livestream.cdn-surfline.com/cdn-live/_definst_/surfline/secure/live/wc-morrocam.smil/playlist.m3u8?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f

➜  Downloads  cat playlist.m3u8 
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=600000,CODECS="avc1.66.30,mp4a.40.2",RESOLUTION=1280x720
chunklist_w1111141041_b600000.m3u8?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f

so the file is:

http://livestream.cdn-surfline.com/cdn-live/_definst_/surfline/secure/live/wc-morrocam.smil/chunklist_w1111141041_b600000.m3u8?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f


➜  Downloads  cat chunklist_w1111141041_b600000.m3u8 
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:NO
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:1027
#EXTINF:5.333,
media_w1111141041_b600000_1027.ts?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f
#EXTINF:5.334,
media_w1111141041_b600000_1028.ts?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f
#EXTINF:4.266,
media_w1111141041_b600000_1029.ts?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f


http://livestream.cdn-surfline.com/cdn-live/_definst_/surfline/secure/live/wc-morrocam.smil/media_w1111141041_b600000_1027.ts?e=1414444797&h=9041ddd031b797ad73d4d2c3aa201c4f







THIS WAS GOOD FOR THE RTMP FLASH PLAYER.

Find the connect and play args by using wireshark and searching for : rtmpt.amf.type

Or tcpdump:

  sudo tcpdump -w file.tcpdump -s 0 -i wlan0

then grep for the "secure" channel:

  tcpdump -A -n -s 0 -r file.tcpdump | grep secure

Youll find a line like:

  /surfline/secure/live/hi-pipelinecam?e=0&h=blablablalalb

This is rtmp stream "file" used for streaming via the flash player I have included..

Other useful greps:

  tcpdump -A -n -s 0 -r file.tcpdump | grep  play

  tcpdump -A -n -s 0 -r file.tcpdump | grep connect


Run:

sudo python -m SimpleHTTPServer 80

to check it locally
