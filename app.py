from flask import Flask, render_template, request, jsonify, url_for
import os

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static'
)

# Create images directory if it doesn't exist
os.makedirs(os.path.join(app.static_folder, 'images'), exist_ok=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    animal_type = request.form.get('animal_type')
    file = request.files['file']
    img_bytes = file.read()
    img_array = preprocess_image(img_bytes)
    
    if animal_type == 'cow':
        prediction = cow_model.predict(img_array)
        classes = ['healthy', 'lsd']
    else:  # dog
        prediction = dog_model.predict(img_array)
        classes = ['fungal_infection', 'healthy', 'hypersensitivity_allergy']
    
    result = {
        'prediction': classes[np.argmax(prediction[0])],
        'confidence': float(np.max(prediction[0]))
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)