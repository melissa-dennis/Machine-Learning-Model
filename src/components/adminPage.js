import React, { useState, useEffect } from 'react';
import '../css/AdminPage.css';

const AdminPage = () => {
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await fetch('http://localhost:2000/prediction');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPredictions(data);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                setError('Error fetching predictions. Please try again later.');
            }
        };

        fetchPredictions();
    }, []);
    const renderPredictionDetails = (features) => {
        const featureKeys = [
            'age', 'anaemia', 'creatinine_phosphokinase', 'diabetes', 
            'ejection_fraction', 'high_blood_pressure', 'platelets', 
            'serum_creatinine', 'serum_sodium', 'sex', 'smoking', 'time'
        ];
    
        return featureKeys.map((key) => (
            <td key={key}>
                {features[key]}
            </td>
        ));
    };
       

    const deletePrediction = async (prediction_id) => {
        try {
            const response = await fetch(`http://localhost:2000/prediction/${prediction_id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete the prediction');
            }
            // Remove the deleted prediction from the state
            setPredictions(predictions.filter(prediction => prediction._id !== prediction_id));
        } catch (error) {
            console.error('Error deleting prediction:', error);
            setError('Error deleting prediction. Please try again later.');
        }
    };

    const handleDelete = async (prediction_id) => {
        try {
            await deletePrediction(prediction_id);
        } catch (error) {
            console.error('Error deleting prediction:', error);
            setError('Error deleting prediction. Please try again later.');
        }
    };
    return (
        <div className="admin-page">
            <h2>Admin - Predictions</h2>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                predictions.length > 0 ? (
                    <div className="table-responsive">
                        <table className="predictions-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Age</th>
                                    <th>Anaemia</th>
                                    <th>Creatinine Phosphokinase</th>
                                    <th>Diabetes</th>
                                    <th>Ejection Fraction</th>
                                    <th>High Blood Pressure</th>
                                    <th>Platelets</th>
                                    <th>Serum Creatinine</th>
                                    <th>Serum Sodium</th>
                                    <th>Sex</th>
                                    <th>Smoking</th>
                                    <th>Time</th>
                                    <th>Prediction</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.map((prediction) => (
                                    <tr key={prediction._id}>
                                        <td>{prediction.username}</td>
                                        {renderPredictionDetails(prediction.features)}
                                        <td>{prediction.prediction}</td>
                                        <td>
                                            <button onClick={() => handleDelete(prediction._id)} className="delete-btn">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                       </table>
                    </div>
                ) : (
                    <p>No predictions to display.</p>
                )
            )}
        </div>
    );
};

export default AdminPage;
