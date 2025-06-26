find /usr/share/nginx/html -name '*.js' -exec sed -i "s|API_BASE_URL|${API_BASE_URL}|g" {} \;
nginx -g "daemon off;"
