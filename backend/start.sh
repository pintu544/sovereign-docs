#!/bin/bash
# Start Sovereign Docs backend via egress forwarder (avoids httpx proxy-parse bug)
for v in https_proxy http_proxy HTTPS_PROXY HTTP_PROXY ALL_PROXY all_proxy; do
  unset $v
done
export HTTPS_PROXY=http://127.0.0.1:8888
export HTTP_PROXY=http://127.0.0.1:8888
export NO_PROXY=localhost,127.0.0.1
export no_proxy=localhost,127.0.0.1
cd ~/workspace/hack-apertus/backend
exec ./venv/bin/python app.py
