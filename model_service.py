from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# Setup MongoDB connection
client = MongoClient('mongodb://localhost:27017')
db = client['AI_Project']
predictions_collection = db['predictions']

# Load your trained model
model_path = r'C:\Users\MSI\OneDrive\Desktop\Winter2024\COMP377_001_AI\logistic_regression_trained_pipeline.pkl'
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Define a mapping dictionary for prediction labels
prediction_labels = {
    0: "No death event",
    1: "Possible death event"
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        username = data.get('username')
        features = data.get('features')

        if features is None:
            return jsonify({'error': 'Missing features in the request'}), 400

        # Convert features to a pandas DataFrame
        features_df = pd.DataFrame([features])

        # Ensure all values are numeric and not empty strings
        features_df = features_df.apply(pd.to_numeric, errors='coerce')

        # Check if there are any NaN values after coercion
        if features_df.isnull().values.any():
            # Fill NaN values with a default value, mean, or another appropriate value
            # Make sure the method matches how you handled it during model training
            features_df.fillna(features_df.mean(), inplace=True)

        # Predict using the model
        prediction = model.predict(features_df)

        # Map numerical predictions to labels
        prediction_label = prediction_labels.get(prediction[0], "Unknown")

        # Create the prediction record with the username
        prediction_record = {
            'username': username,
            'features': features,
            'prediction': prediction_label
        }

        print("Inserting the following record to MongoDB:", prediction_record)
        insert_result = predictions_collection.insert_one(prediction_record)
        print("Inserted record ID:", insert_result.inserted_id)

        return jsonify({'prediction': prediction_label, 'id': str(insert_result.inserted_id)}), 200

    except Exception as e:
        app.logger.error(f'Error in prediction: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/prediction', methods=['GET'])
def get_predictions():
    try:
        predictions_data = predictions_collection.find({})
        predictions = [prediction for prediction in predictions_data]
        # Convert ObjectId to string for JSON serializability
        predictions = [{**prediction, '_id': str(prediction['_id'])} for prediction in predictions]
        return jsonify(predictions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/prediction/<prediction_id>', methods=['DELETE'])
def delete_prediction(prediction_id):
    try:
        result = predictions_collection.delete_one({'_id': ObjectId(prediction_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Prediction not found'}), 404
        return jsonify({'message': 'Prediction deleted'}), 200
    except Exception as e:
        app.logger.error(f'Error in /predictions DELETE: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=2000)
