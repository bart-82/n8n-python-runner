FROM n8nio/runners:2.3.5

# Copia la tua config in un punto separato
COPY n8n-task-runners5.json /tmp/n8n-task-runners.override.json

# Patch della config di default (che contiene già i command corretti)
RUN node -e "\
const fs=require('fs');\
const base=JSON.parse(fs.readFileSync('/etc/n8n-task-runners.json','utf8'));\
const ov=JSON.parse(fs.readFileSync('/tmp/n8n-task-runners.override.json','utf8'));\
base['allowed-env']=[...(new Set([...(base['allowed-env']||[]), ...(ov['allowed-env']||[])]))];\
fs.writeFileSync('/etc/n8n-task-runners.json', JSON.stringify(base,null,2));\
"
