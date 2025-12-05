from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

from ..db import SessionLocal
from ..models.note import Note

notes_bp = Blueprint("notes", __name__)


def current_user_id() -> int:
    return int(get_jwt_identity())


@notes_bp.get("")
@jwt_required()
def list_notes():
    user_id = current_user_id()
    folder_id = request.args.get("folder_id", type=int)
    with SessionLocal() as db:
        query = select(Note).where(Note.owner_id == user_id)
        if folder_id is not None:
            query = query.where(Note.folder_id == folder_id)
        notes = db.scalars(query.order_by(Note.updated_at.desc())).all()
        return jsonify([
            {
                "id": n.id,
                "title": n.title,
                "content": n.content,
                "is_favorite": n.is_favorite,
                "folder_id": n.folder_id,
                "updated_at": n.updated_at.isoformat(),
            }
            for n in notes
        ])


@notes_bp.post("")
@jwt_required()
def create_note():
    user_id = current_user_id()
    payload = request.get_json() or {}
    title = (payload.get("title") or "Untitled").strip() or "Untitled"
    content = payload.get("content") or ""
    folder_id = payload.get("folder_id")
    with SessionLocal() as db:
        note = Note(title=title, content=content, owner_id=user_id, folder_id=folder_id)
        db.add(note)
        db.commit()
        db.refresh(note)
        return jsonify({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "is_favorite": note.is_favorite,
            "folder_id": note.folder_id,
            "updated_at": note.updated_at.isoformat(),
        }), 201


@notes_bp.put("/<int:note_id>")
@jwt_required()
def update_note(note_id: int):
    user_id = current_user_id()
    payload = request.get_json() or {}
    with SessionLocal() as db:
        note = db.get(Note, note_id)
        if not note or note.owner_id != user_id:
            return jsonify(error="Not found"), 404
        if "title" in payload:
            note.title = (payload.get("title") or note.title).strip() or note.title
        if "content" in payload:
            note.content = payload.get("content") or ""
        if "folder_id" in payload:
            note.folder_id = payload.get("folder_id")
        db.commit()
        db.refresh(note)
        return jsonify({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "is_favorite": note.is_favorite,
            "folder_id": note.folder_id,
            "updated_at": note.updated_at.isoformat(),
        })


@notes_bp.delete("/<int:note_id>")
@jwt_required()
def delete_note(note_id: int):
    user_id = current_user_id()
    with SessionLocal() as db:
        note = db.get(Note, note_id)
        if not note or note.owner_id != user_id:
            return jsonify(error="Not found"), 404
        db.delete(note)
        db.commit()
        return jsonify(message="Deleted")


@notes_bp.post("/<int:note_id>/favorite")
@jwt_required()
def toggle_favorite(note_id: int):
    user_id = current_user_id()
    with SessionLocal() as db:
        note = db.get(Note, note_id)
        if not note or note.owner_id != user_id:
            return jsonify(error="Not found"), 404
        note.is_favorite = not note.is_favorite
        db.commit()
        db.refresh(note)
        return jsonify({"id": note.id, "is_favorite": note.is_favorite})
