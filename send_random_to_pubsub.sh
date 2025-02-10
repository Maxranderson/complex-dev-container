#!/bin/bash

# Variables
TOPIC_NAME=$TOPIC # Replace with your Pub/Sub topic name
PROJECT_ID=$PUBSUB_PROJECT_ID # Replace with your project ID

generate_random_id() {
  echo $(tr -dc A-Za-z0-9 </dev/urandom | head -c 13)
}

if [ $# -lt 1 ]; then
    echo "Usage: $0 <message>"
    exit 1
fi

MESSAGE=""
for m in "$@"; do
    MESSAGE="$MESSAGE$m "
done
MESSAGE=$(echo "$MESSAGE" | xargs)

ID=$(generate_random_id)
DATA="{ \"id\": \"$ID\", \"message\":\"$MESSAGE\"}"
curl -X POST "${PUBSUB_EMULATOR_HOST}/v1/projects/${PROJECT_ID}/topics/${TOPIC_NAME}:publish" \
    -H "Content-Type: application/json" \
    -d "{
          \"messages\": [
            {
              \"data\": \"$(echo "$DATA" | base64 -w 0)\"
            }
          ]
        }"

echo "ID Sent: $ID"
