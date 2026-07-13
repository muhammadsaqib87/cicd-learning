# Use the official lightweight Python 3.14 image.
FROM python:3.14-slim


# Prevent Python from creating .pyc cache files inside the container.
ENV PYTHONDONTWRITEBYTECODE=1

# Send Python output directly to the container logs.
# Without this, output may be buffered and appear later.
ENV PYTHONUNBUFFERED=1


# Set the container's working directory.
#
# The remaining commands operate relative to /app.
WORKDIR /app


# Copy the dependency file first.
#
# Docker can reuse the dependency-installation layer when
# requirements.txt has not changed.
COPY requirements.txt ./requirements.txt


# Upgrade pip and install the backend dependencies.
#
# --no-cache-dir prevents pip's download cache from being stored
# inside the final Docker image.
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt


# Create a non-root Linux user for running the application.
#
# Installing packages requires elevated permissions, but the web
# application itself should not normally run as root.
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser


# Copy only the FastAPI source package into the image.
COPY --chown=appuser:appgroup app ./app


# Run the application as the non-root user.
USER appuser


# Document that this application listens on port 8000.
EXPOSE 8000


# Let Docker periodically verify that FastAPI is responding.
#
# This request runs inside the container, so it uses 127.0.0.1.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2).read()"


# Start the FastAPI application.
#
# 0.0.0.0 is essential inside a container. It allows traffic
# forwarded by Docker to reach the Uvicorn server.
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]