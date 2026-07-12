"""
Main FastAPI application.

This module creates the API and defines its HTTP endpoints.
"""

from fastapi import FastAPI


# Create the FastAPI application object.
#
# Uvicorn imports this variable when it starts the server.
# Our automated tests will import this exact same object.
app = FastAPI(
    title="Student CI/CD Application",
    description=(
        "A small project for learning FastAPI, React, "
        "Docker, GitHub and CI/CD."
    ),
    version="0.1.0",
)


@app.get("/")
def read_root() -> dict[str, str]:
    """
    Return a welcome message from the backend.

    HTTP request:
        GET /

    JSON response:
        {
            "message": "Hello from FastAPI!"
        }
    """

    return {"message": "Hello from FastAPI!"}


@app.get("/health")
def health_check() -> dict[str, str]:
    """
    Deliberately incorrect response used to test our CI pipeline.
    """

    return {"status": "broken"}



@app.get("/version")
def get_version() -> dict[str, str]:
    """
    Return the current application version.

    A version endpoint can help developers and deployment systems
    identify which release of the application is currently running.
    """

    return {"version": "0.1.0"}