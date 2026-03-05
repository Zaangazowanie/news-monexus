#!/bin/bash
cd /root/.openclaw/workspace/news-monexus
export NEXT_PUBLIC_VARIANT_NAME=SHADOW
exec npx next start -p 3103
