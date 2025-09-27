#!/usr/bin/env bash
set -euo pipefail
systemctl daemon-reload
systemctl start backend
sleep 2
systemctl status backend --no-pager || true
