from flask import Blueprint, request, jsonify
from sqlalchemy import select
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from ..db import SessionLocal
from ..models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json() or {}
    email = (payload.get("email") or "").strip().lower()
    name = (payload.get("name") or "").strip()
    password = payload.get("password") or ""

    if not email or not password or not name:
        return jsonify(error="Missing required fields"), 400

    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == email)):
            return jsonify(error="Email already registered"), 409

        user = User(email=email, name=name, password_hash=generate_password_hash(password))
        db.add(user)
        db.commit()

    return jsonify(message="Registered"), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json() or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify(error="Invalid credentials"), 401

        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token, user={"id": user.id, "email": user.email, "name": user.name})
