"""
Main FastAPI application.

This module:
- Creates the FastAPI application
- Configures browser access through CORS
- Defines the root, health, and version endpoints
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# Create the FastAPI application.
app = FastAPI(
    title="Student CI/CD Application",
    description=(
        "A small project for learning FastAPI, React, "
        "Docker, GitHub and CI/CD."
    ),
    version="0.1.0",
)


# These are the frontend addresses permitted to call this API
# from JavaScript running in a web browser.
#
# localhost and 127.0.0.1 both refer to your computer, but the
# browser treats them as different hostnames, so we include both.
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


# CORS means Cross-Origin Resource Sharing.
#
# This middleware adds the HTTP headers that tell the browser:
# "Requests from our React development server are allowed."
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,

    # We are not using login cookies or authorization credentials yet.
    allow_credentials=False,

    # Our frontend currently sends only GET requests.
    allow_methods=["GET"],

    # Permit normal request headers.
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    """
    Return a simple welcome message.
    """

    return {"message": "Hello from FastAPI!"}


@app.get("/health")
def health_check() -> dict[str, str]:
    """
    Report whether the backend application is responding.
    """

    return {"status": "ok"}


@app.get("/version")
def get_version() -> dict[str, str]:
    """
    Return the current backend application version.
    """

    return {"version": "0.1.0"}