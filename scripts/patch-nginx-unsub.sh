#!/usr/bin/env bash
# Ensures /api/unsub is proxied on the production nginx host.
# Run ON THE SERVER: bash scripts/patch-nginx-unsub.sh

set -euo pipefail

SNIPPET='    location = /api/unsub {
        proxy_pass http://168.144.122.72/prod/CMMTN/unsub$is_args$args;
        proxy_set_header Host 168.144.122.72;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        add_header Access-Control-Allow-Origin *;
    }'

find_config() {
  for f in \
    /etc/nginx/sites-enabled/oncook* \
    /etc/nginx/sites-enabled/default \
    /etc/nginx/conf.d/oncook*.conf \
    /var/www/vasnumero/oncook/nginx.conf
  do
  if [ -f "$f" ]; then
    echo "$f"
    return 0
  fi
  done
  return 1
}

CONFIG="$(find_config || true)"
if [ -z "$CONFIG" ]; then
  echo "ERROR: Could not find nginx site config. Add this block after /api/login manually:"
  echo "$SNIPPET"
  exit 1
fi

echo "Using nginx config: $CONFIG"

if grep -q 'location.*/api/unsub' "$CONFIG"; then
  echo "OK: /api/unsub block already present."
else
  if ! grep -q '/api/login' "$CONFIG"; then
    echo "ERROR: /api/login not found in $CONFIG — paste snippet manually:"
    echo "$SNIPPET"
    exit 1
  fi
  TMP="$(mktemp)"
  awk -v snippet="$SNIPPET" '
    { print }
    /location \/api\/login/ { in_login=1 }
    in_login && /^[[:space:]]*}[[:space:]]*$/ && !done {
      print snippet
      done=1
      in_login=0
    }
  ' "$CONFIG" > "$TMP"
  cp "$CONFIG" "${CONFIG}.bak.$(date +%Y%m%d%H%M%S)"
  mv "$TMP" "$CONFIG"
  echo "Added /api/unsub block to $CONFIG"
fi

nginx -t
systemctl reload nginx
echo "Done. Test: curl -s 'https://oncook.co/api/unsub?cp=1&pid=1&msisdn=TEST' | head -c 120"
