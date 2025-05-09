# api.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from function import mediapipe_detection, extract_keypoints, mp_holistic
import base64
import uvicorn
from pydantic import BaseModel

# Khởi tạo FastAPI
app = FastAPI(title="Sign Language Recognition API")

# Cấu hình CORS để frontend có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong môi trường production, hãy giới hạn nguồn gốc cho an toàn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model('action_kdn.h5')

actions = ['toi', 'thich', 'mau hong', 'none']

# Định nghĩa model nhận dữ liệu
class ImageData(BaseModel):
    image: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
async def predict(data: ImageData):
    try:
        # Giải mã hình ảnh từ base64
        img_data = base64.b64decode(data.image)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Xử lý hình ảnh với MediaPipe
        with mp_holistic.Holistic(min_detection_confidence=0.75, min_tracking_confidence=0.75) as holistic:
            # Phát hiện các điểm mốc
            image, results = mediapipe_detection(frame, holistic)
            
            # Trích xuất điểm đặc trưng
            keypoints = extract_keypoints(results)
            
            # Dự đoán
            prediction = model.predict(np.expand_dims([keypoints], axis=0))[0]
            predicted_class = actions[np.argmax(prediction)]
            confidence = float(prediction[np.argmax(prediction)])
        
        return {
            "prediction": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        return {"error": str(e)}

# Chạy server
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)