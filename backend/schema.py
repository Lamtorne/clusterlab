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
    culture: str | None = Field(description='Культура, выращиваемая на поле (пшеница, кукуруза и т.д.). Для более '
                                            'точных рекомендаций - standard, pro')
    latitude: float = Field(..., description='Широта центра поля', ge=-90, le=90)
    longitude: float = Field(..., description='Долгота центра поля', ge=-180, le=180)
    radius: float = Field(..., description='Радиус поля в метрах', ge=5, le=3000)
    region: str | None = Field(description='Регион (область, край, республика). Для более точных рекомендаций - standard, pro')


class Field(BaseModel):
    id: int
    user_id: int
    culture: str | None = Field(description='Культура, выращиваемая на поле (пшеница, кукуруза и т.д.). Для более '
                                            'точных рекомендаций - standard, pro', max_length=150)
    latitude: float = Field(..., description='Широта центра поля', ge=-90, le=90)
    longitude: float= Field(..., description='Долгота центра поля', ge=-180, le=180)
    radius: float = Field(..., description='Радиус поля в метрах', ge=5, le=3000)
    region: str | None = Field(description='Регион (область, край, республика). Для более точных рекомендаций - standard, pro', max_length=150)
    model_config = ConfigDict(from_attributes=True)


class RefreshTokenRequest(BaseModel):
    refresh_token: str
