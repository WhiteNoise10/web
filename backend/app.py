from datetime import timedelta
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .db import init_db
from .routes.auth import auth_bp
from .routes.folders import folders_bp
from .routes.notes import notes_bp
from .routes.profile import profile_bp


def create_app() -> Flask:
    app_lcorp = Flask(__name__)
    app_lcorp.config["JSON_SORT_KEYS"] = False
    app_lcorp.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    app_lcorp.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=6)

    CORS(app_lcorp, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app_lcorp)

    # Database init
    init_db()

    # Routes
    app_lcorp.register_blueprint(auth_bp, url_prefix="/api/auth")
    app_lcorp.register_blueprint(folders_bp, url_prefix="/api/folders")
    app_lcorp.register_blueprint(notes_bp, url_prefix="/api/notes")
    app_lcorp.register_blueprint(profile_bp, url_prefix="/api/profile")

    @app_lcorp.get("/api/health")
    def health():
        return jsonify(status="ok"), 200

    return app_lcorp


# Flask CLI entrypoint
app = create_app()
