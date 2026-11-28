# Plant Disease FastAPI Demo

This project connects the 38-class TensorFlow image classifier in `train_plant.ipynb` to a FastAPI service and a small browser demo. Visitors can upload a leaf photo and see the predicted class, confidence, and top three model scores.

## 1. Export the trained model

Run the notebook through training, then run the final **Export model for FastAPI** cell. In Google Colab, it downloads `plant_model_bundle.zip`. Extract that ZIP into this folder so `trained_model.keras` and `class_names.json` sit beside `main.py`.

The labels are exported from `training_data.class_names` so their order matches the model outputs.

## 2. Install and start the app (Windows PowerShell)

```powershell
cd "$HOME\Downloads\plant_disease_fastapi"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload
```

TensorFlow is a large dependency, so the first install can take a few minutes. Native Windows TensorFlow runs on CPU by default.

## 3. Show the project

- Open <http://127.0.0.1:8000> for the upload-and-prediction demo.
- Open <http://127.0.0.1:8000/docs> to show the interactive `POST /predict` API.
- Open <http://127.0.0.1:8000/health> to confirm that the model loaded.

The app shows **Model files needed** until both exported artifacts are in this folder. Use a clear leaf image under 10 MB for the live demo.

## Suggested presentation flow

1. Explain the problem: identifying plant leaf diseases from images.
2. Show the notebook's CNN training and validation.
3. Show how FastAPI loads the saved model once when the server starts.
4. Upload a sample leaf photo and explain the returned class and confidence.
5. Open `/docs` to show that the prediction is available as an API endpoint.

The classifier predicts only among the categories represented in its training data. A confidence score is a model estimate, not a guaranteed diagnosis.
