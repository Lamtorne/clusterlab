from fastapi import FastAPI
from backend.routers import users

app = FastAPI(
    title='ClusterLab',
    version='0.1.0'
)

app.include_router(users.router)

@app.get('/')
async def root():
    return {'message': 'Welcome to ClusterLab'}
