cd ..
babel src/ --watch --out-dir out/ &
watchify out/client.js -o public/main.js &

tail -f /dev/null
