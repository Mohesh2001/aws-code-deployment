#!/usr/bin/env bash
set -euo pipefail
cd /opt/app/current

# Create/refresh venv
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

# Optional: DB migrations / assets here
