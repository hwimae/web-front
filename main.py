import cv2
import numpy as np
from tensorflow.keras.models import load_model
from function import *
#from grammar_correction import *
import keyboard

# Load trained model
model = load_model('action_kdn.h5')

# Define your class labels (replace with your actual actions)
actions = ['toi','thich','mau hong','none']  # Replace this list with your actual actions

# Detection variables
sequence = []
sentence = []
grammar_result = []
threshold = 0.2
count = 0
last_prediction = ''

# Use webcam (0 is default camera, change if needed)
cap = cv2.VideoCapture(0)

# Set up MediaPipe Holistic model
with mp_holistic.Holistic(min_detection_confidence=0.75, min_tracking_confidence=0.75) as holistic:
    while cap.isOpened():
        ret, frame = cap.read()

        # Detect landmarks
        image, results = mediapipe_detection(frame, holistic)
        draw_styled_landmarks(image, results)

        # Extract keypoints
        keypoints = extract_keypoints(results)
        sequence.append(keypoints)
        sequence = sequence[-30:]

        if len(sequence) == 30:
            res = model.predict(np.expand_dims(sequence, axis=0))[0]
            print(actions[np.argmax(res)])
            print(count)
            predicted_action = actions[np.argmax(res)]
            confidence = res[np.argmax(res)]
            print(f"Prediction: {predicted_action}, Confidence: {confidence}")

            if res[np.argmax(res)] > threshold and actions[np.argmax(res)] != 'none':
                if len(sentence) > 0:
                    if actions[np.argmax(res)] == last_prediction and actions[np.argmax(res)] != sentence[-1]:
                        count += 1
                else:
                    if actions[np.argmax(res)] == last_prediction:
                        count += 1

                if count > 15:
                    count = 0

                if len(sentence) > 0:
                    if count > 10 and actions[np.argmax(res)] != sentence[-1]:
                        sentence.append(actions[np.argmax(res)])
                        count = 0
                else:
                    if count > 10:
                        sentence.append(actions[np.argmax(res)])
                        count = 0

                last_prediction = actions[np.argmax(res)]

        # Limit sentence length to 3 words for display
        if len(sentence) > 3:
            sentence = sentence[-3:]

        # # Reset everything if Spacebar is pressed
        # if keyboard.is_pressed(' '):
        #     sentence, sequence, grammar_result = [], [], []

        # # Apply grammar correction if Enter is pressed
        # if keyboard.is_pressed('enter'):
        #     text = ' '.join(sentence)
        #     # grammar_result = grammar_correction(text)

        key = cv2.waitKey(10) & 0xFF

        # Nhấn Space để reset
        if key == ord(' '):
            sentence, sequence, grammar_result = [], [], []

        # Nhấn Enter để sửa ngữ pháp
        if key == 13:
            text = ' '.join(sentence)
          #  grammar_result = grammar_correction(text)

        # Display result
        if grammar_result:
            textsize = cv2.getTextSize(grammar_result, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)[0]
            text_X_coord = (image.shape[1] - textsize[0]) // 2
            cv2.putText(image, grammar_result, (text_X_coord, 470), cv2.FONT_HERSHEY_SIMPLEX, 1, (144, 238, 144), 2, cv2.LINE_AA)
        else:
            cv2.putText(image, ' '.join(sentence), (150, 470), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        cv2.imshow('OpenCV Feed', image)

        # Exit when 'q' is pressed
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
