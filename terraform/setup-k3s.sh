#!/bin/bash
# VM 啟動時自動執行（user_data）

# 安裝 K3s（輕量版 Kubernetes，單節點最佳選擇）
curl -sfL https://get.k3s.io | sh -

# 等 K3s 啟動
sleep 15

# 部署網站（K3s 內建 kubectl）
cat <<'EOF' | k3s kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: marco-resume
spec:
  replicas: 2
  selector:
    matchLabels:
      app: marco-resume
  template:
    metadata:
      labels:
        app: marco-resume
    spec:
      containers:
        - name: marco-resume
          image: ghcr.io/marcowang-0423/marco-resume:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "50m"
              memory: "32Mi"
            limits:
              cpu: "100m"
              memory: "64Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: marco-resume
spec:
  selector:
    app: marco-resume
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
EOF
