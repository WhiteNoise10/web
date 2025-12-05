from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

from ..db import SessionLocal
from ..models.folder import Folder

folders_bp = Blueprint("folders", __name__)


def current_user_id() -> int:
    return int(get_jwt_identity())


@folders_bp.get("")
@jwt_required()
def list_folders():
    user_id = current_user_id()
    with SessionLocal() as db:
        folders = db.scalars(select(Folder).where(Folder.owner_id == user_id).order_by(Folder.created_at.desc())).all()
        return jsonify([{"id": f.id, "name": f.name, "created_at": f.created_at.isoformat()} for f in folders])


@folders_bp.post("")
@jwt_required()
def create_folder():
    user_id = current_user_id()
    payload = request.get_json() or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return jsonify(error="Name is required"), 400
    with SessionLocal() as db:
        folder = Folder(name=name, owner_id=user_id)
        db.add(folder)
        db.commit()
        db.refresh(folder)
        return jsonify({"id": folder.id, "name": folder.name, "created_at": folder.created_at.isoformat()}), 201


@folders_bp.put("/<int:folder_id>")
@jwt_required()
def rename_folder(folder_id: int):
    user_id = current_user_id()
    payload = request.get_json() or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return jsonify(error="Name is required"), 400
    with SessionLocal() as db:
        folder = db.get(Folder, folder_id)
        if not folder or folder.owner_id != user_id:
            return jsonify(error="Not found"), 404
        folder.name = name
        db.commit()
        return jsonify(message="Updated")


@folders_bp.delete("/<int:folder_id>")
@jwt_required()
def delete_folder(folder_id: int):
    user_id = current_user_id()
    with SessionLocal() as db:
        folder = db.get(Folder, folder_id)
        if not folder or folder.owner_id != user_id:
            return jsonify(error="Not found"), 404
        db.delete(folder)
        db.commit()
        return jsonify(message="Deleted")
