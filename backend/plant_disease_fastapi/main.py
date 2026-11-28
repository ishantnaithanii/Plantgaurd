from __future__ import annotations

from contextlib import asynccontextmanager
from io import BytesIO
import json
import os
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import UnidentifiedImageError
from tensorflow import keras

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "trained_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "class_names.json"
IMAGE_SIZE = (128, 128)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024

model: Any | None = None
class_names: list[str] | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names

    if MODEL_PATH.is_file() and CLASS_NAMES_PATH.is_file():
        class_names = json.loads(CLASS_NAMES_PATH.read_text(encoding="utf-8"))
        if not isinstance(class_names, list) or not all(
            isinstance(name, str) for name in class_names
        ):
            raise RuntimeError(f"{CLASS_NAMES_PATH.name} must contain a JSON list of class names.")

        model = keras.models.load_model(MODEL_PATH, compile=False)
        output_classes = model.output_shape[-1]
        if output_classes != len(class_names):
            raise RuntimeError(
                f"The model has {output_classes} outputs, but {CLASS_NAMES_PATH.name} "
                f"contains {len(class_names)} class names. Export both from the same notebook run."
            )
        app.state.model_ready = True
    else:
        app.state.model_ready = False

    yield


app = FastAPI(
    title="Plant Disease Classifier API",
    description="Classify a plant leaf image with the TensorFlow model from train_plant.ipynb.",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/health")
def health():
    ready = bool(getattr(app.state, "model_ready", False))
    return {
        "status": "ready" if ready else "model_missing",
        "model_loaded": ready,
        "required_files": [MODEL_PATH.name, CLASS_NAMES_PATH.name],
    }


@app.post("/predict")
def predict(file: UploadFile = File(...)):
    if model is None or class_names is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "The model is not installed. Run the final export cell in train_plant.ipynb, "
                "then extract trained_model.keras and class_names.json into this API folder."
            ),
        )

    image_bytes = file.file.read(MAX_UPLOAD_BYTES + 1)
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 10 MB or smaller.")

    try:
        image = keras.utils.load_img(
            BytesIO(image_bytes),
            target_size=IMAGE_SIZE,
            color_mode="rgb",
        )
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(
            status_code=400,
            detail="Could not read the upload as an image. Use JPEG, PNG, or another supported image format.",
        ) from exc

    # The notebook sends raw RGB pixel values (0-255) to the model; do not normalize here.
    image_array = np.expand_dims(keras.utils.img_to_array(image), axis=0)
    scores = model.predict(image_array, verbose=0)[0]
    best_index = int(np.argmax(scores))
    label = class_names[best_index]
    crop, separator, condition = label.partition("___")
    top_indices = np.argsort(scores)[::-1][:3]

    return {
        "filename": file.filename,
        "prediction": label,
        "crop": crop.replace("_", " "),
        "condition": condition.replace("_", " ") if separator else "",
        "confidence": float(scores[best_index]),
        "top_predictions": [
            {"label": class_names[int(index)], "confidence": float(scores[index])}
            for index in top_indices
        ],
    }
