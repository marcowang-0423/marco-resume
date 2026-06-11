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

---

## 3. 日常「重新啟動」流程（VM 已關機，要重新打開網站）

| 步驟 | 指令 / 操作 | 說明 |
|---|---|---|
| 1 | AWS Console → EC2 → 勾選 instance → **Instance state → Start instance** | 開機，等狀態變 `Running`、Status check `2/2` |
| 2 | 在 instance 詳細資訊查看新的 **Public IPv4 address** | 每次開機 IP 都會變 |
| 3 | `ssh -i marco-resume-key.pem ubuntu@<新IP>`（在 `.ssh` 資料夾下執行） | 連線進去 |
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
