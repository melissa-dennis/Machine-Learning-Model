// PredictPage.js
import React, { useState } from 'react';
import '../css/PredictForm.css';

const PredictPage = () => {


    // Initialize state with all the form fields
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        anaemia: '',
        creatinine_phosphokinase: '',
        diabetes: '',
        ejection_fraction: '',
        high_blood_pressure: '',
        platelets: '',
        serum_creatinine: '',
        serum_sodium: '',
        sex: '',
        smoking: '',
        time: '',
    });
    const [prediction, setPrediction] = useState('');

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

       
        const payload = {
            username: formData.name,
            features: { ...formData }
        };
    
        try {
            const response = await fetch('http://localhost:2000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // Sending the payload in the expected format
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            setPrediction(result.prediction); // Update the prediction state with the result
        } catch (error) {
            console.error("Error in making prediction: ", error);
            setPrediction('Failed to make prediction'); // Provide error feedback
        }
    };
    

    return (
        <div className="predict-form-container">
            <h1>Predict Health Event</h1>
            <form onSubmit={handleSubmit} className="predict-form">
            <label>
                    Enter username:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>               
                <label>
                    Enter the patient's age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </label>
                {/* Repeat for each field */}
                <label>
                    Does the patient have anaemia? (1 for Yes, 0 for No):
                    <input
                        type="number"
                        name="anaemia"
                        value={formData.anaemia}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Enter the creatinine phosphokinase level (100 - 8000):
                    <input type="number" name="creatinine_phosphokinase" value={formData.creatinine_phosphokinase} onChange={handleChange} required/>
                </label>
                <label>
                    Does the patient have diabetes? (1 for Yes, 0 for No):
                    <input type="number" name="diabetes" value={formData.diabetes} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the ejection fraction percentage (15 - 65):
                    <input type="number" name="ejection_fraction" value={formData.ejection_fraction} onChange={handleChange} required/>
                </label>
                <label>
                    Does the patient have high blood pressure? (1 for Yes, 0 for No):
                    <input type="number" name="high_blood_pressure" value={formData.high_blood_pressure} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the platelets count (125000 - 400000):
                    <input type="number" name="platelets" value={formData.platelets} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the serum creatinine level (0.90 - 9.4):
                    <input type="number" name="serum_creatinine" value={formData.serum_creatinine} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the serum sodium level (115 - 150):
                    <input type="number" name="serum_sodium" value={formData.serum_sodium} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the patient's sex (1 for Male, 0 for Female):
                    <input type="number" name="sex" value={formData.sex} onChange={handleChange} required/>
                </label>
                <label>
                    Does the patient smoke? (1 for Yes, 0 for No):
                    <input type="number" name="smoking" value={formData.smoking} onChange={handleChange} required/>
                </label>
                <label>
                    Enter the follow-up period in days:
                    <input type="number" name="time" value={formData.time} onChange={handleChange} />
                </label>
                <button type="submit" className="predict-btn">Submit for Prediction</button>
            </form>
            {prediction && <div className="prediction-result">Prediction: {prediction}</div>}
        </div>
    );
};

export default PredictPage;
