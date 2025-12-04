from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UsageItem(BaseModel):
    message_id: int
    timestamp: str
    report_name: Optional[str] = None
    credits_used: float


class UsageResponse(BaseModel):
    usage: List[UsageItem]

def calculate_credits(text: str, base_model_rate: float = 40) -> float:
    estimated_count = len(text)
    credits_used = round(max((estimated_count / 100) * base_model_rate, 1.0), 2)
    return credits_used

@app.get("/usage", response_model=UsageResponse)
def get_usage():
    # Load messages from data.json
    data_path = os.path.join(os.path.dirname(__file__), "data.json")
    with open(data_path, "r") as f:
        data = json.load(f)
    messages = data.get("messages", [])

    usage_list = []
    base_model_rate = 40

    for msg in messages:
        message_id = msg["id"]
        timestamp = msg["timestamp"]
        report_id = msg.get("report_id")
        report_name = None
        credits_used = 1.0

        if report_id is not None:
            # Fetch report info from external endpoint
            try:
                url = f"https://owpublic.blob.core.windows.net/tech-task/reports/{report_id}"
                resp = requests.get(url, timeout=5)
                if resp.status_code == 200:
                    report_data = resp.json()
                    report_name = report_data.get("name")
                    credits_used = float(report_data.get("credit_cost", 1.0))
                    if credits_used < 1.0:
                        credits_used = 1.0
                else:
                    # fallback to calculated if fetch fails
                    credits_used = calculate_credits(msg.get("text", ""), base_model_rate)
            except Exception:
                # fallback to calculated if error
                credits_used = calculate_credits(msg.get("text", ""), base_model_rate)
        else:
            # Calculate credits for messages without report_id
            credits_used = calculate_credits(msg.get("text", ""), base_model_rate)

        usage_list.append(UsageItem(
            message_id=message_id,
            timestamp=timestamp,
            report_name=report_name,
            credits_used=credits_used
        ))

    return UsageResponse(usage=usage_list)
