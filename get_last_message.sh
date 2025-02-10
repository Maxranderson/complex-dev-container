MESSAGE_ID=$1

if [ $# -lt 1 ]; then
    echo "Usage: $0 <message_id>"
    exit 1
fi

curl -X GET "http://localhost:3000/messages/$MESSAGE_ID"