FROM n8nio/runners:2.3.5

USER root

# patch del file completo incluso nell'immagine
COPY patch-task-runners.js /tmp/patch-task-runners.js
RUN node /tmp/patch-task-runners.js

USER runner
