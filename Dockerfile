FROM nginx:alpine

# 把所有靜態檔案複製進 nginx 的預設網站目錄
COPY . /usr/share/nginx/html

# 移除不需要放進 image 的檔案
RUN rm -rf /usr/share/nginx/html/.github \
           /usr/share/nginx/html/terraform \
           /usr/share/nginx/html/k8s \
           /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/.dockerignore \
           /usr/share/nginx/html/README.md

EXPOSE 80
