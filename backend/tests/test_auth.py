import pytest
from app.auth.security import get_password_hash, verify_password, create_access_token, decode_access_token


def test_password_hashing():
    plain = "SuperSecret123!"
    hashed = get_password_hash(plain)

    # Must not match plaintext
    assert hashed != plain
    # Must verify correctly
    assert verify_password(plain, hashed) is True
    # Must fail on incorrect password
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_creation_and_decode():
    email = "test.author@example.com"
    user_id = 42

    token = create_access_token(subject=email, user_id=user_id)
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == email
    assert payload["user_id"] == user_id
    assert "exp" in payload
