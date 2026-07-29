# Etap 1: Build zależności
FROM python:3.11-slim AS builder

WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends gcc libffi-dev libssl-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Etap 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Skopiuj zainstalowane pakiety z buildera
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Skopiuj kod aplikacji
COPY app/ ./app/
COPY modules/ ./modules/
COPY migrations/ ./migrations/
COPY alembic.ini .

# Upewnij się że katalogi istnieją (dla volume mounts)
RUN mkdir -p /app/data /app/uploads

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
