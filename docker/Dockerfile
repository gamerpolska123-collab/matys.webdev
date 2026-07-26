FROM python:3.11-slim

WORKDIR /app

# Zależności systemowe dla bcrypt/cryptography + cleanup
RUN apt-get update && apt-get install -y --no-install-recommends     gcc     libffi-dev     libssl-dev     && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Utworzenie katalogów
RUN mkdir -p /app/data /app/app/static/uploads

EXPOSE 8000

# Upewnij się że słucha na wszystkich interfejsach (ważne w Dockerze!)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
