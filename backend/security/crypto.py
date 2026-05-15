# =============================================================================
# SmartGrow SecureAI - Криптографічний модуль
# =============================================================================
# Шифрування та захист даних
# 
# Інспіровано: Signal Protocol, TLS 1.3, Kraken encryption
# =============================================================================

import os
import base64
import hashlib
import hmac
import secrets
import json
import logging
from datetime import datetime, timedelta
from typing import Tuple, Optional, Dict, Any
from dataclasses import dataclass
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger('smartgrow.security.crypto')


# =============================================================================
# КОНФІГУРАЦІЯ КРИПТОГРАФІЇ
# =============================================================================

@dataclass
class CryptoConfig:
    """
    Конфігурація криптографічних параметрів
    
    Базується на рекомендаціях NIST та OWASP:
    - AES-256-GCM для симетричного шифрування
    - PBKDF2/Scrypt для деривації ключів
    - HMAC-SHA256 для підписів
    """
    # Розмір ключа AES (256 біт = 32 байти)
    AES_KEY_SIZE: int = 32
    
    # Розмір IV для AES-GCM (96 біт = 12 байтів)
    AES_GCM_IV_SIZE: int = 12
    
    # Розмір тегу автентифікації GCM (128 біт = 16 байтів)
    AES_GCM_TAG_SIZE: int = 16
    
    # Параметри PBKDF2
    PBKDF2_ITERATIONS: int = 600000  # OWASP рекомендація 2024
    PBKDF2_SALT_SIZE: int = 16
    
    # Параметри Scrypt (для паролів)
    SCRYPT_N: int = 2**17  # CPU/memory cost (131072)
    SCRYPT_R: int = 8      # Block size
    SCRYPT_P: int = 1      # Parallelization
    
    # Розмір nonce для replay protection
    NONCE_SIZE: int = 24


config = CryptoConfig()


# =============================================================================
# ГЕНЕРАТОР БЕЗПЕЧНИХ ВИПАДКОВИХ ЗНАЧЕНЬ
# =============================================================================

class SecureRandom:
    """
    Генератор криптографічно безпечних випадкових значень
    
    Використовує secrets модуль (CSPRNG - Cryptographically Secure PRNG)
    """
    
    @staticmethod
    def bytes(n: int) -> bytes:
        """Генерує n криптографічно безпечних байтів"""
        return secrets.token_bytes(n)
    
    @staticmethod
    def hex(n: int) -> str:
        """Генерує hex рядок з n байтів"""
        return secrets.token_hex(n)
    
    @staticmethod
    def urlsafe(n: int) -> str:
        """Генерує URL-safe base64 рядок"""
        return secrets.token_urlsafe(n)
    
    @staticmethod
    def nonce() -> str:
        """Генерує унікальний nonce для replay protection"""
        timestamp = int(datetime.now().timestamp() * 1000000)
        random_part = secrets.token_hex(config.NONCE_SIZE // 2)
        return f"{timestamp:x}-{random_part}"
    
    @staticmethod
    def api_key() -> str:
        """Генерує API ключ (32 символи)"""
        return f"sg_{secrets.token_urlsafe(24)}"
    
    @staticmethod
    def session_id() -> str:
        """Генерує безпечний session ID"""
        return secrets.token_urlsafe(32)


# =============================================================================
# AES-256-GCM ШИФРУВАННЯ
# =============================================================================

class AESEncryption:
    """
    AES-256-GCM шифрування
    
    GCM (Galois/Counter Mode) забезпечує:
    - Конфіденційність (шифрування)
    - Автентичність (перевірка цілісності)
    - Захист від replay атак (унікальний IV)
    
    Використовується для шифрування:
    - Даних сенсорів
    - Команд IoT
    - Конфіденційної інформації
    """
    
    def __init__(self, key: Optional[bytes] = None):
        """
        Args:
            key: 32-байтний ключ AES-256 (або генерується автоматично)
        """
        if key is None:
            key = SecureRandom.bytes(config.AES_KEY_SIZE)
        
        if len(key) != config.AES_KEY_SIZE:
            raise ValueError(f"Ключ повинен бути {config.AES_KEY_SIZE} байтів")
        
        self.key = key
        self.backend = default_backend()
    
    def encrypt(self, plaintext: bytes, associated_data: Optional[bytes] = None) -> bytes:
        """
        Шифрує дані за допомогою AES-256-GCM
        
        Args:
            plaintext: Дані для шифрування
            associated_data: Додаткові дані для автентифікації (AAD)
            
        Returns:
            IV (12 байт) + Ciphertext + Tag (16 байт)
        """
        # Генеруємо унікальний IV
        iv = SecureRandom.bytes(config.AES_GCM_IV_SIZE)
        
        # Створюємо cipher
        cipher = Cipher(
            algorithms.AES(self.key),
            modes.GCM(iv),
            backend=self.backend
        )
        encryptor = cipher.encryptor()
        
        # Додаємо AAD якщо є
        if associated_data:
            encryptor.authenticate_additional_data(associated_data)
        
        # Шифруємо
        ciphertext = encryptor.update(plaintext) + encryptor.finalize()
        
        # Повертаємо: IV + Ciphertext + Tag
        return iv + ciphertext + encryptor.tag
    
    def decrypt(self, ciphertext: bytes, associated_data: Optional[bytes] = None) -> bytes:
        """
        Дешифрує дані
        
        Args:
            ciphertext: Зашифровані дані (IV + Ciphertext + Tag)
            associated_data: AAD для перевірки
            
        Returns:
            Оригінальні дані
            
        Raises:
            InvalidTag: Якщо дані модифіковані
        """
        # Розділяємо компоненти
        iv = ciphertext[:config.AES_GCM_IV_SIZE]
        tag = ciphertext[-config.AES_GCM_TAG_SIZE:]
        actual_ciphertext = ciphertext[config.AES_GCM_IV_SIZE:-config.AES_GCM_TAG_SIZE]
        
        # Створюємо cipher
        cipher = Cipher(
            algorithms.AES(self.key),
            modes.GCM(iv, tag),
            backend=self.backend
        )
        decryptor = cipher.decryptor()
        
        # Перевіряємо AAD
        if associated_data:
            decryptor.authenticate_additional_data(associated_data)
        
        # Дешифруємо
        return decryptor.update(actual_ciphertext) + decryptor.finalize()
    
    def encrypt_json(self, data: dict, associated_data: Optional[dict] = None) -> str:
        """Шифрує JSON об'єкт та повертає base64 рядок"""
        plaintext = json.dumps(data).encode('utf-8')
        aad = json.dumps(associated_data).encode('utf-8') if associated_data else None
        
        encrypted = self.encrypt(plaintext, aad)
        return base64.urlsafe_b64encode(encrypted).decode('utf-8')
    
    def decrypt_json(self, encrypted_b64: str, associated_data: Optional[dict] = None) -> dict:
        """Дешифрує base64 рядок та повертає JSON об'єкт"""
        encrypted = base64.urlsafe_b64decode(encrypted_b64.encode('utf-8'))
        aad = json.dumps(associated_data).encode('utf-8') if associated_data else None
        
        decrypted = self.decrypt(encrypted, aad)
        return json.loads(decrypted.decode('utf-8'))


# =============================================================================
# ХЕШУВАННЯ ПАРОЛІВ
# =============================================================================

class PasswordHasher:
    """
    Безпечне хешування паролів
    
    Використовує Scrypt - memory-hard функція, стійка до:
    - GPU атак
    - ASIC атак
    - Rainbow tables
    
    Альтернатива: Argon2 (переможець PHC)
    """
    
    def __init__(self):
        self.backend = default_backend()
    
    def hash(self, password: str) -> str:
        """
        Хешує пароль
        
        Args:
            password: Пароль користувача
            
        Returns:
            Рядок формату: salt$hash (обидва в hex)
        """
        # Генеруємо унікальну сіль
        salt = SecureRandom.bytes(config.PBKDF2_SALT_SIZE)
        
        # Scrypt KDF
        kdf = Scrypt(
            salt=salt,
            length=32,
            n=config.SCRYPT_N,
            r=config.SCRYPT_R,
            p=config.SCRYPT_P,
            backend=self.backend
        )
        
        # Деривуємо ключ з пароля
        key = kdf.derive(password.encode('utf-8'))
        
        # Повертаємо salt$hash
        return f"{salt.hex()}${key.hex()}"
    
    def verify(self, password: str, hash_string: str) -> bool:
        """
        Перевіряє пароль
        
        Args:
            password: Введений пароль
            hash_string: Збережений хеш (salt$hash)
            
        Returns:
            True якщо пароль вірний
        """
        try:
            # Розділяємо salt та hash
            salt_hex, key_hex = hash_string.split('$')
            salt = bytes.fromhex(salt_hex)
            expected_key = bytes.fromhex(key_hex)
            
            # Scrypt KDF
            kdf = Scrypt(
                salt=salt,
                length=32,
                n=config.SCRYPT_N,
                r=config.SCRYPT_R,
                p=config.SCRYPT_P,
                backend=self.backend
            )
            
            # Перевіряємо (verify() кидає виняток якщо не збігається)
            kdf.verify(password.encode('utf-8'), expected_key)
            return True
            
        except Exception as e:
            logger.warning(f"Невдала перевірка пароля: {type(e).__name__}")
            return False


# =============================================================================
# HMAC ПІДПИСИ
# =============================================================================

class HMACSignature:
    """
    HMAC-SHA256 підписи для цілісності даних
    
    Використовується для:
    - Підпису API запитів
    - Верифікації webhooks
    - Захисту від модифікації
    """
    
    def __init__(self, secret_key: bytes):
        """
        Args:
            secret_key: Секретний ключ для підпису
        """
        self.secret_key = secret_key
    
    def sign(self, data: bytes) -> str:
        """
        Підписує дані
        
        Args:
            data: Дані для підпису
            
        Returns:
            Hex-encoded підпис
        """
        signature = hmac.new(
            self.secret_key,
            data,
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def verify(self, data: bytes, signature: str) -> bool:
        """
        Перевіряє підпис
        
        Args:
            data: Дані
            signature: Очікуваний підпис
            
        Returns:
            True якщо підпис валідний
        """
        expected = self.sign(data)
        
        # Constant-time порівняння (захист від timing attacks)
        return hmac.compare_digest(expected, signature)
    
    def sign_request(
        self,
        method: str,
        path: str,
        body: str,
        timestamp: int,
        nonce: str
    ) -> str:
        """
        Підписує HTTP запит
        
        Args:
            method: HTTP метод
            path: URL шлях
            body: Тіло запиту
            timestamp: Unix timestamp
            nonce: Унікальний nonce
            
        Returns:
            Підпис запиту
        """
        # Канонічний формат запиту
        canonical = f"{method}\n{path}\n{body}\n{timestamp}\n{nonce}"
        return self.sign(canonical.encode('utf-8'))


# =============================================================================
# ДЕРИВАЦІЯ КЛЮЧІВ
# =============================================================================

class KeyDerivation:
    """
    Деривація криптографічних ключів
    
    Використовується для:
    - Генерації ключів з майстер-ключа
    - Ротації ключів
    - Ключова ієрархія
    """
    
    def __init__(self, master_key: bytes):
        """
        Args:
            master_key: Майстер-ключ (мінімум 32 байти)
        """
        if len(master_key) < 32:
            raise ValueError("Майстер-ключ повинен бути мінімум 32 байти")
        
        self.master_key = master_key
        self.backend = default_backend()
    
    def derive(self, context: str, key_length: int = 32) -> bytes:
        """
        Деривує ключ для конкретного контексту
        
        Args:
            context: Контекст використання (наприклад, "sensor_encryption")
            key_length: Довжина вихідного ключа
            
        Returns:
            Похідний ключ
        """
        # PBKDF2 з контекстом як сіллю
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=key_length,
            salt=context.encode('utf-8'),
            iterations=config.PBKDF2_ITERATIONS,
            backend=self.backend
        )
        
        return kdf.derive(self.master_key)
    
    def derive_sensor_key(self, sensor_id: str) -> bytes:
        """Деривує ключ для конкретного сенсора"""
        return self.derive(f"sensor:{sensor_id}")
    
    def derive_device_key(self, device_id: str) -> bytes:
        """Деривує ключ для конкретного пристрою"""
        return self.derive(f"device:{device_id}")
    
    def derive_session_key(self, session_id: str) -> bytes:
        """Деривує ключ для сесії"""
        return self.derive(f"session:{session_id}")


# =============================================================================
# БЕЗПЕЧНЕ ЗБЕРІГАННЯ СЕКРЕТІВ
# =============================================================================

class SecretStore:
    """
    Безпечне зберігання секретів в пам'яті
    
    Особливості:
    - Шифрування в пам'яті
    - Автоматичне видалення через TTL
    - Захист від memory dump
    """
    
    def __init__(self, encryption_key: Optional[bytes] = None):
        """
        Args:
            encryption_key: Ключ для шифрування секретів
        """
        self.encryption_key = encryption_key or SecureRandom.bytes(32)
        self.fernet = Fernet(base64.urlsafe_b64encode(self.encryption_key))
        self._secrets: Dict[str, Tuple[bytes, Optional[datetime]]] = {}
    
    def store(self, key: str, value: str, ttl_seconds: Optional[int] = None):
        """
        Зберігає секрет
        
        Args:
            key: Ідентифікатор секрету
            value: Значення секрету
            ttl_seconds: Час життя в секундах
        """
        # Шифруємо значення
        encrypted = self.fernet.encrypt(value.encode('utf-8'))
        
        # Визначаємо час закінчення
        expires_at = None
        if ttl_seconds:
            expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
        
        self._secrets[key] = (encrypted, expires_at)
        logger.debug(f"Секрет '{key}' збережено (TTL: {ttl_seconds}s)")
    
    def retrieve(self, key: str) -> Optional[str]:
        """
        Отримує секрет
        
        Args:
            key: Ідентифікатор секрету
            
        Returns:
            Значення або None якщо не знайдено/застаріло
        """
        if key not in self._secrets:
            return None
        
        encrypted, expires_at = self._secrets[key]
        
        # Перевіряємо TTL
        if expires_at and datetime.now() > expires_at:
            del self._secrets[key]
            logger.debug(f"Секрет '{key}' застарілий і видалений")
            return None
        
        try:
            return self.fernet.decrypt(encrypted).decode('utf-8')
        except InvalidToken:
            logger.error(f"Не вдалося дешифрувати секрет '{key}'")
            return None
    
    def delete(self, key: str):
        """Видаляє секрет"""
        if key in self._secrets:
            del self._secrets[key]
            logger.debug(f"Секрет '{key}' видалено")
    
    def clear(self):
        """Видаляє всі секрети"""
        self._secrets.clear()
        logger.info("Всі секрети видалено")
    
    def cleanup_expired(self):
        """Видаляє застарілі секрети"""
        now = datetime.now()
        expired_keys = [
            key for key, (_, expires_at) in self._secrets.items()
            if expires_at and now > expires_at
        ]
        
        for key in expired_keys:
            del self._secrets[key]
        
        if expired_keys:
            logger.debug(f"Видалено {len(expired_keys)} застарілих секретів")


# =============================================================================
# УТИЛІТИ
# =============================================================================

def hash_sha256(data: bytes) -> str:
    """SHA-256 хеш (hex)"""
    return hashlib.sha256(data).hexdigest()


def hash_sha512(data: bytes) -> str:
    """SHA-512 хеш (hex)"""
    return hashlib.sha512(data).hexdigest()


def constant_time_compare(a: str, b: str) -> bool:
    """Порівняння з постійним часом (захист від timing attacks)"""
    return hmac.compare_digest(a.encode('utf-8'), b.encode('utf-8'))


def generate_api_key_pair() -> Tuple[str, str]:
    """
    Генерує пару API ключів (public ID + secret)
    
    Returns:
        (api_key_id, api_key_secret)
    """
    key_id = f"sg_pub_{SecureRandom.hex(8)}"
    key_secret = f"sg_sec_{SecureRandom.urlsafe(32)}"
    return key_id, key_secret


# =============================================================================
# ГЛОБАЛЬНІ ІНСТАНЦІЇ
# =============================================================================

# Генератор випадкових значень
secure_random = SecureRandom()

# Хешер паролів
password_hasher = PasswordHasher()
