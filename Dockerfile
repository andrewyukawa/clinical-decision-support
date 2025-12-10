# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt /app/backend/requirements.txt

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run the application
WORKDIR /app/backend
# Railway will set PORT env var, but we need to read it in Python
# So we use a shell script or direct python execution
CMD python -c "import os, uvicorn; from app import app; port = int(os.environ.get('PORT', 8000)); uvicorn.run(app, host='0.0.0.0', port=port)"

