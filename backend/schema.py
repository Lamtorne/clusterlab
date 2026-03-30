from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime, timedelta


class UserCreate(BaseModel):
    email: EmailStr = Field(..., description='Email пользователя')
    full_name: str = Field(..., min_length=2, description='Имя или название компании')
    password: str = Field(..., min_length=8, description='Пароль (минимум 8 символов)')


class User(BaseModel):
    id: int
    email: EmailStr
    tariff: str = Field(default='test', description='Тариф: test, standard, pro')
    tariff_ends_at: datetime = Field(default_factory=lambda: datetime.now() + timedelta(days=7))
    current_area: float = Field(default=0.0, description='Проанализированная площадь')
    max_area: float = Field(default=10.0, description='Максимальная площадь для анализа')
    model_config = ConfigDict(from_attributes=True)


class FieldCreate(BaseModel):
    culture: str = Field(description='Культура, выращиваемая на поле. Для более точных рекомендаций - standard, pro')
    latitude: float = Field(..., description='Широта центра поля')
    longitude: float = Field(..., description='Долгота центра поля')
    radius: float = Field(..., description='Радиус поля в метрах')
    region: str = Field(description='Регион (область, край, республика). Для более точных рекомендаций - standard, pro')


class Field(BaseModel):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class RefreshTokenRequest(BaseModel):
    refresh_token: str
