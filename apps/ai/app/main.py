import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Etsy Intelligence AI Service", 
    description="Microservice managing AI optimization and analysis tools",
    version="1.0.0"
)

class OptimizeListingRequest(BaseModel):
    title: str
    description: str
    tags: List[str]
    category: str

class OptimizeListingResponse(BaseModel):
    optimized_title: str
    optimized_description: str
    suggested_tags: List[str]
    recommendations: str

class GenerateTagsRequest(BaseModel):
    keyword: str
    category: str

class GenerateTagsResponse(BaseModel):
    tags: List[str]

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "ai-microservice"}

@app.post("/optimize-listing", response_model=OptimizeListingResponse)
async def optimize_listing(request: OptimizeListingRequest):
    # Under Phase 9, this will be integrated with Gemini/OpenAI prompt pipelines.
    # Return mock results for Phase 1 architecture verification.
    return OptimizeListingResponse(
        optimized_title=f"[SEO Optimized] {request.title} | Best Gift for Him & Her",
        optimized_description=f"{request.description}\n\n⭐ Key Features ⭐\n- Premium Quality\n- Handmade Craftsmanship\n- Custom Personalization Available",
        suggested_tags=request.tags + ["handmade gift", "etsyseller", "gift ideas"],
        recommendations="We updated the title to follow Etsy's 140 character limit and frontloaded primary keywords. Included a structured bulleted layout in description for better readability."
    )

@app.post("/generate-tags", response_model=GenerateTagsResponse)
async def generate_tags(request: GenerateTagsRequest):
    return GenerateTagsResponse(
        tags=[
            request.keyword,
            f"handmade {request.keyword}",
            f"custom {request.keyword}",
            "gift ideas",
            f"vintage {request.keyword}"
        ]
  )
