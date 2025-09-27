#!/usr/bin/env bash
set -euo pipefail

# Stop old service if present
systemctl stop backend || true

# Clean deploy dir (optional, keeps logs)
mkdir -p /opt/app/current
find /opt/app/current -mindepth 1 -maxdepth 1 ! -name ".venv" -exec rm -rf {} +

# Ensure ownership
chown -R ec2-user:ec2-user /opt/app/current
