from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, Task, init_db
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
CORS(app)
init_db()

@app.route("/tasks", methods=["GET"])
def get_tasks():
    db = SessionLocal()
    try:
        tasks = db.query(Task).all()
        return jsonify([{"id": t.id, "task": t.task} for t in tasks])
    finally:
        db.close()

@app.route("/add", methods=["POST"])
def add_task():
    data = request.get_json()
    text = data.get("task", "").strip()
    if not text:
        return jsonify({"error": "Empty task"}), 400
    db = SessionLocal()
    try:
        new = Task(task=text)
        db.add(new)
        db.commit()
        db.refresh(new)
        return jsonify({"id": new.id, "task": new.task})
    except SQLAlchemyError as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/delete/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    db = SessionLocal()
    try:
        item = db.get(Task, task_id)
        if not item:
            return jsonify({"error": "Not found"}), 404
        db.delete(item)
        db.commit()
        return jsonify({"message": "Deleted"})
    finally:
        db.close()

if __name__ == "__main__":
    app.run(debug=True)
