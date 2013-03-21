Find the connect and play args by using wireshark and searching for : rtmpt.amf.type

Or tcpdump:
sudo tcpdump: -w file.tcpdump -s 0 -i wlan0
then grep for the "secure" channel:
tcpdump -A -n -s 0 -r file.tcpdump | grep secure

Youll find a line like:
/surfline/secure/live/hi-pipelinecam?e=0&h=blablablalalb

This is rtmp stream "file" used for streaming via the flash player I have included..

Other useful greps:
tcpdump -A -n -s 0 -r file.tcpdump | grep  play
tcpdump -A -n -s 0 -r file.tcpdump | grep connect
