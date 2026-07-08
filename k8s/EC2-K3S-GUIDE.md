# AWS EC2 + K3s 部署網站 — 操作筆記

這份文件記錄「第一次部署」「日常重啟」「結束關機」三個流程，
以及每個指令在做什麼。網站用 K3s（輕量版 Kubernetes）跑在一台
AWS EC2 t3.micro 上。

---

## 0. 基本資訊

| 項目 | 內容 |
|---|---|
| Instance type | t3.micro（免費方案，1GB RAM） |
| 作業系統 | Ubuntu |
| SSH 使用者 | `ubuntu` |
| 金鑰檔 | `C:\Users\王思喬\.ssh\marco-resume-key.pem` |
| Docker image | `ghcr.io/marcowang-0423/marco-resume:latest` |
| 對外 Port (NodePort) | `31465`（Service 自動分配，通常不會變） |
| Public IP | **每次 Start 都會變**（沒設 Elastic IP） |

---

## 1. 第一次設定流程

| 步驟 | 指令 / 操作 | 說明 |
|---|---|---|
| 1 | AWS Console → EC2 → Launch Instance（t3.micro, Ubuntu, 建立金鑰對） | 建立虛擬機器，金鑰對用來 SSH 登入 |
| 2 | Security Group 開放 SSH(22) / HTTP(80) | 允許從外部連線進來 |
| 3 | `ssh -i marco-resume-key.pem ubuntu@<IP>` | 用私鑰登入 EC2 |
| 4 | `curl -sfL https://get.k3s.io \| sh -` | 安裝 K3s（單機版 Kubernetes），自動啟動為 systemd 服務 |
| 5 | `sudo k3s kubectl get nodes` | 確認 K3s 是否安裝成功，node 狀態應為 `Ready` |
| 6 | `cat > /tmp/deploy.yml << 'DONE' ... DONE` | 把 [k8s/deployment.yml](deployment.yml) 內容寫入 EC2 上的檔案 |
| 7 | `sudo k3s kubectl apply -f /tmp/deploy.yml` | 套用 Deployment + Service，K8s 開始建立 2 個 nginx pod |
| 8 | `sudo k3s kubectl get pods` | 確認 2 個 pod 是否 `Running` |
| 9 | `sudo k3s kubectl get svc marco-resume` | 查看 Service 對外開放的 NodePort（例如 `31465`） |
| 10 | Security Group 新增規則：Custom TCP, port 31465, source 0.0.0.0/0 | 開放剛才那個 NodePort，外部才連得進來 |
| 11 | 瀏覽器打開 `http://<IP>:31465` | 確認網站可以正常顯示 |

### 中途解決的問題：記憶體不足
t3.micro 只有 911Mi RAM，K3s + 2 個 pod 同時啟動會超過可用記憶體，
導致 `kubectl` 指令出現 `TLS handshake timeout`。解法是建立 swap（見下方指令解釋）。

---

## 2. 指令解釋

| 指令 | 用途 |
|---|---|
| `curl -sfL https://get.k3s.io \| sh -` | 下載並安裝 K3s，安裝完會自動以 systemd 服務啟動 |
| `sudo systemctl status k3s` | 查看 K3s 服務目前是否在執行（`active (running)`） |
| `sudo systemctl restart k3s` | 重新啟動 K3s 服務（設定變更後常用） |
| `sudo k3s kubectl get nodes` | 查詢 cluster 裡的「機器」清單與狀態（`Ready`/`NotReady`） |
| `sudo k3s kubectl get pods` | 查詢目前正在跑的 container（pod）數量與狀態 |
| `sudo k3s kubectl get svc <name>` | 查詢 Service 設定，包含對外開放的 Port（NodePort） |
| `sudo k3s kubectl apply -f <檔案>` | 套用 YAML 設定檔，K8s 會自動建立/更新對應資源 |
| `free -h` | 查看記憶體（Mem）與 swap 使用量，單位自動轉換成 KB/MB/GB |
| `sudo fallocate -l 1G /swapfile` | 建立一個 1GB 大小的檔案，準備當作 swap 空間 |
| `sudo chmod 600 /swapfile` | 限制檔案權限，只有 root 能讀寫（swap 檔案安全要求） |
| `sudo mkswap /swapfile` | 把這個檔案格式化成 swap 格式 |
| `sudo swapon /swapfile` | 啟用這個 swap（立即生效，但重開機會消失） |
| `echo '/swapfile none swap sw 0 0' \| sudo tee -a /etc/fstab` | 把 swap 設定寫入開機自動掛載清單，**重開機後仍會生效** |

**Swap 是什麼：** 把硬碟空間當成「備用記憶體」。RAM 不夠時，作業系統把暫時用不到的
資料搬到硬碟上的 swap 檔案，騰出 RAM 給 K3s 等關鍵程式使用。沒有它，RAM 滿了會讓
K3s 卡住或被系統砍掉。

### `cat > 檔案 << 'DONE' ... DONE` 是什麼

```bash
cat > /tmp/deploy.yml << 'DONE'
（這裡貼 YAML 內容）
DONE
```

- `<<` 後面接的 `DONE` 是自己取的「結束標記」（換成 `EOF`、`END` 都可以）
- shell 會把接下來的內容都當成輸入，直到看到**單獨一行、頂格**的 `DONE` 才停止
- `cat > 檔案` 把這段輸入寫進指定檔案
- `'DONE'` 加引號：shell 不會去解讀內容裡的 `$變數`、反引號等特殊符號，整段當純文字處理（YAML 裡常有 `$` 字元，這樣才不會被誤判）

### 一定要這樣寫嗎？不能直接 `cat > /tmp/deploy.yml` 就好嗎

技術上可以：執行 `cat > /tmp/deploy.yml`、貼上 YAML 內容、再按 `Ctrl+D` 結束輸入，
也能把內容寫進檔案。但在 SSH 操作時不建議，原因：

1. **沒辦法一次貼完**：要先打指令按 Enter，再貼內容，最後額外按 `Ctrl+D`，是分好幾個動作。
2. **`Ctrl+D` 在 SSH 裡有風險**：如果搞混「現在是 cat 在等輸入」還是「回到 shell 提示字元」，
   在 shell 提示字元按 `Ctrl+D` 會被當成「結束輸入 → 登出」，**直接把整個 SSH 連線關掉**。
3. **heredoc 是一個自帶結束點、可以整段貼上的指令**：`<< 'DONE' ... DONE` 整包貼進終端機，
   shell 自動知道在哪裡結束，不需要再多按任何鍵，也不會誤觸登出。

簡單說：`cat > 檔案` 是「互動式」寫法（要人在旁邊按 Ctrl+D），heredoc 是「整段貼上、自動結束」的寫法，比較適合複製貼上指令到 SSH 終端機。

---

## 3. 日常「重新啟動」流程（VM 已關機，要重新打開網站）

| 步驟 | 指令 / 操作 | 說明 |
|---|---|---|
| 1 | AWS Console → EC2 → 勾選 instance → **Instance state → Start instance** | 開機，等狀態變 `Running`、Status check `2/2` |
| 2 | 在 instance 詳細資訊查看新的 **Public IPv4 address** | 每次開機 IP 都會變 |
| 3 | `ssh -i marco-resume-key.pem ubuntu@<新IP>`（在 `.ssh` 資料夾下執行） C:\Users\王思喬\.ssh> | 連線進去 |
| 4 | `free -h` | 確認 swap 是否還在（已寫入 `/etc/fstab` 後，之後每次開機都會自動有 swap，**這步以後可省略**） |
| 5 | `sudo k3s kubectl get nodes` | 確認 node 是 `Ready`（K3s 開機自動啟動，不用重新安裝） |
| 6 | `sudo k3s kubectl get pods` | 確認 2 個 pod 是 `Running`（部署設定保存在硬碟，不用重新 apply） |
| 7 | `sudo k3s kubectl get svc marco-resume` | 確認 NodePort 還是 `31465` |
| 8 | 瀏覽器打開 `http://<新IP>:31465` | 確認網站正常 |

> ⚠️ Security Group 規則（含 port 31465）是綁在 instance 上的設定，重開機不會消失，不用重設。

---

## 4. 結束 / 關機流程

| 步驟 | 指令 / 操作 | 說明 |
|---|---|---|
| 1 | 在 EC2 終端機輸入 `exit` | 離開 SSH 連線 |
| 2 | AWS Console → EC2 → 勾選 instance → **Instance state → Stop instance** | 關機，停止計費的運算時間 |

關機後資料（K3s、pod 設定、swap 設定）都保留在硬碟（EBS）上，
下次 Start 時會自動恢復，只是 IP 會換新的（回到「第 3 節：重新啟動流程」）。

---

## 5. 修改部署設定（更新網站版本 / 調整設定）

### 情境 A：網站內容更新了，要套用新版 image（最常見）

push 程式碼到 GitHub 後，CI 會自動 build 新的 Docker image 並推到 ghcr.io（tag 還是 `latest`）。
但 K3s 不會自動發現「`latest` 背後的內容變了」，需要手動告訴它重新抓：

```bash
sudo k3s kubectl rollout restart deployment marco-resume
```

| 指令 | 用途 |
|---|---|
| `sudo k3s kubectl rollout restart deployment marco-resume` | 讓 K8s 重新建立所有 pod（image tag 是 `latest`，重建時會重新 pull 最新版本） |
| `sudo k3s kubectl rollout status deployment marco-resume` | 即時查看更新進度，看到 `successfully rolled out` 代表完成 |

K8s 會做 **rolling update**：先建立新 pod、確認 `Running` 且健康後，才刪除舊 pod —— 過程中網站不會中斷。

### 情境 B：改 YAML 設定本身（例如調整 replica 數量、資源限制）

1. 編輯本機 [k8s/deployment.yml](deployment.yml)（例如把 `replicas: 2` 改成 `replicas: 3`）
2. 用前面的 heredoc 方法，把新內容覆寫到 EC2 的 `/tmp/deploy.yml`
3. 重新套用：
   ```bash
   sudo k3s kubectl apply -f /tmp/deploy.yml
   ```

`kubectl apply` 是「**比對差異、只調整變動的部分**」，不是整個重來 —— 例如把 replicas 從 2 改成 3，K8s 只會多開 1 個 pod，原本 2 個不受影響。
