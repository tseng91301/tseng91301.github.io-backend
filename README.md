# tseng91301.github.io-backend

本專案提供 [tseng91301.github.io](https://tseng91301.github.io) 的後端核心服務。架構已全面轉向 **Docker 容器化** 部署。

## 專案架構 (Architecture)

本專案採用容器化微服務架構，由以下服務組成：

1.  **local-server (Node.js API)**: 使用 Express.js 提供 HTTP 接口，處理時間預約相關後端請求。
2.  **backend-redis (Redis)**: 作為各服務間的資料暫存與傳輸媒介，利用 Pub/Sub 機制處理預約通知。
3.  **discord-messenger (Python Bot)**: 負責監聽 Redis 頻道，並即時將預約資訊推播至 Discord。
4.  **discord-manager (Python Bot)**: 提供 Discord 介面供管理者確認伺服器運作狀態。

## 外部檔案系統連結 (Persistent Data)

為了確保資料持久化且易於存取，本專案預設將容器內的 `/data` 路徑與主機的 `./external_data/` 目錄進行綁定掛載 (Bind Mount)。
- **用途**: 任何存放在容器中 `/data` 下的檔案都會自動同步到主機目錄，反之亦然。這非常適合儲存日誌、暫存檔或擴充配置。

---

## 建置與安裝 (Quick Start)

### 1. 準備環境變數
將專案根目錄下的 `.env.example` 複製一份並命名為 `.env`：
```bash
cp .env.example .env
```
編輯 `.env` 並填入您的 Discord Bot **Token** 與 **Channel ID**。

### 2. 啟動服務
確保您的系統已安裝 Docker 與 Docker Compose (V2)，接著在根目錄執行：
```bash
docker compose up -d --build
```
> **提示**: `--build` 參數能確保每次啟動時都會根據最新的程式碼與套件清單重新打包映像檔。

---

## 運行與管理 (Usage)

### 檢視服務狀態
```bash
docker compose ps
```

### 查看日誌 (Logs)
- 查看所有日誌: `docker compose logs -f`
- 只看 Node API 伺服器日誌: `docker compose logs -f local-server`

### 重啟單一服務
若您修改了 `local_server/` 下的程式碼並想立即生效：
```bash
docker compose restart local-server
```

### 停止整個環境
```bash
docker compose down
```

---

## 專案目錄結構 (Directory Structure)

```text
tseng91301.github.io-backend/
├── docker-compose.yml       # Docker 服務統籌設定中心
├── Dockerfile.node          # Node.js 服務建置腳本
├── Dockerfile.python        # Python Bot 服務建置腳本
├── .env                     # 環境變數設定檔 (需手動建立)
├── external_data/           # 外部綁定掛載目錄 (與容器 /data 同步)
├── requirements.txt         # Python 依賴清單
├── discord_bot/             # Discord 機器人核心邏輯
├── local_server/            # Express.js API 伺服器
└── server_manage.py         # 伺服器管理機器人入口
```