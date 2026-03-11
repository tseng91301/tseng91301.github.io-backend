#!/bin/bash

SESSION_NAME="my-line-api-local-server"

echo "Checking for existing tmux session named '$SESSION_NAME'..."

# 檢查 tmux 伺服器是否正在運行
if ! tmux has-session -t $SESSION_NAME 2>/dev/null; then
  echo "No existing session named '$SESSION_NAME' found."
else
  echo "Existing session '$SESSION_NAME' found. Killing it..."
  # 如果存在，則關閉該 session
  tmux kill-session -t $SESSION_NAME
  echo "Session '$SESSION_NAME' killed."
fi

echo "Adding new session $SESSION_NAME"

# 建立新的 tmux session，不自動附加
tmux new-session -d -s $SESSION_NAME -n "node.js server" "echo 'Starting node server...' && cd ./local_server && node server.js"

# 附加到這個 session
# tmux attach-session -t $SESSION_NAME
