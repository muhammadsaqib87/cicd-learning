"""
Automated tests for the FastAPI application.

Pytest discovers this file because its name begins with "test_".
It also discovers functions whose names begin with "test_".
"""

from fastapi.testclient import TestClient

from app.main import app


# Create a test client connected directly to our FastAPI application.
#
# This client can send simulated HTTP requests without requiring
# us to manually start the Uvicorn web server.
client = TestClient(app)


def test_read_root() -> None:
    """
    Confirm that the root endpoint returns the expected response.
    """

    # Arrange:
    # The TestClient and FastAPI application have already been created.

    # Act:
    # Send a simulated GET request to the root URL.
    response = client.get("/")

    # Assert:
    # HTTP status code 200 means the request was successful.
    assert response.status_code == 200

    # Confirm that the response body contains exactly the JSON
    # contract expected by clients of this API.
    assert response.json() == {
        "message": "Hello from FastAPI!"
    }


def test_health_check() -> None:
    """
    Confirm that the health endpoint reports a healthy application.
    """

    # Send a simulated request to the health endpoint.
    response = client.get("/health")

    # Confirm that FastAPI returned a successful HTTP response.
    assert response.status_code == 200

    # Confirm that the endpoint returned the required status.
    assert response.json() == {
        "status": "ok"
    }



def test_get_version() -> None:
    """
    Confirm that the version endpoint returns the expected version.
    """

    # Send a simulated GET request to the version endpoint.
    response = client.get("/version")

    # The endpoint should respond successfully.
    assert response.status_code == 200

    # Confirm that the API returns the expected application version.
    assert response.json() == {
        "version": "0.1.0"
    }


def test_cors_allows_react_development_server() -> None:
    """
    Confirm that FastAPI allows requests from the React dev server.

    Browsers send an OPTIONS preflight request before some
    cross-origin requests. CORSMiddleware answers that request.
    """

    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    # The CORS preflight request should succeed.
    assert response.status_code == 200

    # FastAPI should explicitly allow the React origin.
    assert (
        response.headers["access-control-allow-origin"]
        == "http://localhost:5173"
    )