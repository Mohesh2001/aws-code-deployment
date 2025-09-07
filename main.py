# main.py
from fastapi import FastAPI, HTTPException, Depends, Header, status
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector


app = FastAPI(
    title="Plant Healing Assets API",
    description="Login with hardcoded credentials and fetch user-related asset records from MySQL.",
    version="1.0.0",
)

# ---------- Database Config ----------
DB_CONFIG = {
    "host": "localhost",       # change if MySQL runs elsewhere
    "user": "root",            # your MySQL username
    "password": "root", # your MySQL password
    "database": "plant_assets"   # your database name
}

# ---------- Auth ----------
HARDCODED_USERNAME = "Mohesh"
HARDCODED_PASSWORD = "Password@123"
ISSUED_TOKEN = "static-token-123"


# ---------- Schemas ----------
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Asset(BaseModel):
    id: int
    useri: str
    Asses: Optional[str] = None
    AssetName: Optional[str] = None
    Descript: Optional[str] = None
    Latitude: Optional[float] = None
    Longitude: Optional[float] = None


# ---------- Auth Dependency ----------
def require_token(authorization: str = Header(..., description="Use 'Bearer static-token-123' after logging in")):
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")
    token = authorization[len(prefix):].strip()
    if token != ISSUED_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return True


# ---------- Routes ----------
@app.post("/login", response_model=TokenResponse, tags=["Auth"])
def login(body: LoginRequest):
    if body.username == HARDCODED_USERNAME and body.password == HARDCODED_PASSWORD:
        return TokenResponse(access_token=ISSUED_TOKEN)
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


@app.get("/user/{username}", response_model=List[Asset], tags=["User Assets"])
def get_user_assets(username: str, _ok: bool = Depends(require_token)):
    """
    Return all asset rows for the given `username` (case-insensitive match on `useri` column) from MySQL.
    """
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, useri, Asses, AssetName, Descript, Latitude, Longitude
            FROM user_info
            WHERE LOWER(useri) = LOWER(%s)
            ORDER BY id ASC;
            """,
            (username,)
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        if not rows:
            raise HTTPException(status_code=404, detail="No records found for user")

        return [Asset(**row) for row in rows]

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"MySQL error: {err}")


@app.get("/", tags=["Meta"])
def root():
    return {"message": "Plant Healing Assets API running with MySQL", "login": {"username": HARDCODED_USERNAME, "password": HARDCODED_PASSWORD}}
