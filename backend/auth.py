from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # объект, хэширующий пароль


def hash_password(password: str) -> str:
    '''
    password to hash using bcrypt algorithm
    '''
    return pwd_context.hash(password)


def verify_password(password: str, hash_password: str) -> bool:
    '''
    verifying password through using password hash
    '''
    return pwd_context.verify(password, hash_password)
