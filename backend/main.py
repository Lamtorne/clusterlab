from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users

app = FastAPI(
    title='ClusterLab',
    version='0.1.0'
)

app.include_router(users.router)
app.include_router(fields.router, prefix='/fields')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def root():
    return {'message': 'Welcome to ClusterLab'}
