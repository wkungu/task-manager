# Use official Python image
FROM python:3.11

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy files and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Copy entry point file
COPY entrypoint.sh /entrypoint.sh

# change permissions to the entry file to make it executable
RUN chmod +x /entrypoint.sh

# Run the entrypoint file
CMD ["/entrypoint.sh"]
