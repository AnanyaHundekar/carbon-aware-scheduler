from fastapi import FastAPI
from pydantic import BaseModel

from scheduler.integration import run_full_workflow
from scheduler.config import NORMAL_PRIORITIES

app = FastAPI(title="EcoFlow API")


class WorkflowRequest(BaseModel):
    user_request: str


@app.get("/")
def root():
    return {"status": "EcoFlow API is running"}


@app.post("/run-workflow")
def run_workflow(request: WorkflowRequest):
    result = run_full_workflow(
        request.user_request,
        NORMAL_PRIORITIES
    )

    return result