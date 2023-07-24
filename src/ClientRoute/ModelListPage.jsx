import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ModelListPage.css';
import { BASE_URL } from './AnnotationUtils/domain';

function ModelListPage() {
  const location = useLocation();
  const username = location.state.username;
  const navigate = useNavigate();
  const [modelList, setModelList] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/catalog/getAnnotationList/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        setModelList(data)})
      .catch(error => console.error('Error fetching data', error));
  }, []);

  const handleClick = (id) => {
    navigate("/annotation", { state: { username: username, modelId: id }});
  };

  return (
    <div className="model-list-page">
      <div className="statistics-container">
        <h2>Statistics</h2>
        <p>Model Annotated: <span>{/* Add the model annotation number here */}</span></p>
        <p>Models to Annotate: <span>{/* Add the models to annotate number here */}</span></p>
        <button className="start-annotation-button" onClick={() => handleClick(null)}>Start Annotation</button>
      </div>
      <div className="thumbnails-container">
        <h2>My Annotations</h2>
        <div className="grid">
        {
          modelList.map((model, index) =>{
            return(
            <div className="model-thumbnail" key={index} onClick={() => handleClick(model.modelID)}>
              <img src={model.image} alt={`model ${model.modelID}`}/>
            </div>
            )
          })
        }
        </div>
      </div>
    </div>
  );
}

export default ModelListPage;
