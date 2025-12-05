from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from ..db import SessionLocal
from ..models.user import User

profile_bp = Blueprint("profile", __name__)


def current_user_id() -> int:
    return int(get_jwt_identity())


@profile_bp.get("")
@jwt_required()
def get_profile():
    user_id = current_user_id()
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user:
            return jsonify(error="Not found"), 404
        return jsonify({"id": user.id, "email": user.email, "name": user.name})


@profile_bp.put("")
@jwt_required()
def update_profile():
    user_id = current_user_id()
    payload = request.get_json() or {}
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user:
            return jsonify(error="Not found"), 404
        if "name" in payload:
            user.name = (payload.get("name") or user.name).strip() or user.name
        db.commit()
        return jsonify(message="Name changed success!")


@profile_bp.post("/change-password")
@jwt_required()
def change_password():
    user_id = current_user_id()
    payload = request.get_json() or {}
    current_password = payload.get("current_password") or ""
    new_password = payload.get("new_password") or ""
    if not new_password:
        return jsonify(error="New password required"), 400
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user or not check_password_hash(user.password_hash, current_password):
            return jsonify(error="Invalid credentials"), 401
        user.password_hash = generate_password_hash(new_password)
        db.commit()
        return jsonify(message="Password change GREAT success!")


@profile_bp.delete("")
@jwt_required()
def delete_account():
    user_id = current_user_id()
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user:
            return jsonify(error="Not found"), 404
        db.delete(user)
        db.commit()
        return jsonify(message="Account deleted :(")
