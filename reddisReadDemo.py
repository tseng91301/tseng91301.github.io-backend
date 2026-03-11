import redis, json
r = redis.Redis()
r.publish("newReservation", json.dumps({"content": "🚀 測試訊息 from Redis!"}))
