from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# Load MongoDB URI
MONGO_URI = os.environ.get("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["todo"]   # database name
tasks_collection = db["tasks"]   # collection name


@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = list(tasks_collection.find({}, {"_id": 1, "task": 1}))
    for t in tasks:
        t["id"] = str(t["_id"])
        del t["_id"]
    return jsonify(tasks)


@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    task = data.get("task")

    if not task:
        return jsonify({"error": "Task cannot be empty"}), 400

    result = tasks_collection.insert_one({"task": task})
    return jsonify({"message": "Task added", "id": str(result.inserted_id)})


@app.route("/delete/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    from bson import ObjectId

    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"message": "Task deleted"})


@app.route("/", methods=["GET"])
def home():
    return "Todo backend with MongoDB is running!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
