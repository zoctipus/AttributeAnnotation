// Annotation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { useLocation } from 'react-router-dom';
import Experience from "./AnnotationUtils/Experience.jsx";
import ControlPanel from "./AnnotationUtils/Annotation.jsx";
import * as THREE from 'three'
import './AnnotationPage.css'

function AnnotationPage() {
    const location = useLocation();
    const username = location.state.username;
    const requestedModelId = location.state.modelId;
    const [hover, setHover] = useState(null);
    const [selectState, setSelectState] = useState(null);
    const [selection, setSelection] = useState({});
    const [annotation, setAnnotation] = useState({});
    const [modelID, setModelId] = useState(null)
    const [modelUrl, setModelUrl] = useState(null)
    const [allModelsLabeled, setAllModelsLabeled] = useState(false);
    const pivotControlRef = useRef();
    // ... the rest of your code

    useEffect(() => {
        if (requestedModelId) {
            getModel(requestedModelId);
        } else {
            getModelNot(null);
        }
		
     }, []);

     const handleSave = async () => {
        console.log("Saved");
        console.log(annotation);
    
        try {
            const response = await fetch('http://localhost:3333/catalog/saveAnnotation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: username,  // replace with the actual user ID
                    modelID: modelID,
                    annotation: annotation
                }),
            });
            
            if (!response.ok) {
                console.error(`Server responded with ${response.status}`);
                return;
            }
    
            const { annotationID } = await response.json();
            console.log("Saved annotation with ID:", annotationID);
        } catch(error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = () => {
        console.log("Delete");
        setAnnotation({})
        setSelection({})
    };

    const handleNext = () => {
        console.log("Next");
        setAnnotation({})
        setSelection({})
        getModelNot(modelID) // this model ID refers to current model ID, so the next model is not be same as the current one
    };

    const handlePrevious = () => {
        console.log("Previous");
        setAnnotation({})
        setSelection({})
    };

    useEffect(() => {
        console.log(modelID); // Log the modelID whenever it updates
      }, [modelID]);
    
    const getModel = async (modelID) => {
        try {
            const response = await fetch(`http://localhost:3333/catalog/getModelUrl/${modelID}`);
      
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            
            if (data.error) {
                // Update your UI to display the error message
                console.error(data.error);
            } else {
                const modelUrl = data.modelUrl;
          
                const modelResponse = await fetch(modelUrl);
                if (!modelResponse.ok) {
                    throw new Error(`HTTP error! status: ${modelResponse.status}`);
                }
          
                const blob = await modelResponse.blob();
                const url = URL.createObjectURL(blob);
                setModelUrl(url);
                setModelId(modelID); // No need to get model ID from the server as we already have it
            }
        } catch (error) {
            console.error('Error in fetch:', error);
        }
    };

    const getModelNot = async (modelID) => {
        try {
            let response;
            if (modelID) {
                response = await fetch(`http://localhost:3333/catalog/getNextModelUrl/${modelID}`);
            } else {
                response = await fetch(`http://localhost:3333/catalog/getNextModelUrl/`);
            }
      
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            
            // Check for the noMoreModels property in the response
            if (data.noMoreModels) {
                // Update your UI to display the message
                console.log("Yay! All models are labeled");
                setAllModelsLabeled(true);
            } else {
                const modelUrl = data.modelUrl;
                const returnedModelID = data.modelID; // Renamed to avoid conflict with the parameter modelID
          
                const modelResponse = await fetch(modelUrl);
                if (!modelResponse.ok) {
                    throw new Error(`HTTP error! status: ${modelResponse.status}`);
                }
          
                const blob = await modelResponse.blob();
                const url = URL.createObjectURL(blob);
                setModelUrl(url);
                setModelId(returnedModelID); // Call to setModelId with received modelID
            }
        } catch (error) {
            console.error('Error in fetch:', error);
        }
    };
    
      
    return (
        <div className="app">
            {allModelsLabeled && 
            <>
                <div className="congratulations-message">Yay! All models are labeled!</div>
                <div className="overlay"></div>
            </>
            }
            <div className="canvas-container">
                <Canvas
                    shadows
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 200,
                        position: [4, 2, 6],
                    }}
                    onPointerMissed={() => {
                        setSelectState("deselect");
                        setSelection({});
                    }}
                >
                    <Experience
                        pivotControlRef = {pivotControlRef}
                        hover={hover}
                        setHover={setHover}
                        selectState={selectState}
                        setSelectState={setSelectState}
                        selection={selection}
                        setSelection={setSelection}
                        modelUrl={modelUrl}
                    />
                </Canvas>
            </div>
            <ControlPanel
                annotation={annotation}
                setAnnotation = {setAnnotation}
                selection={selection}
            />
            <div className="button-group">
                {/* <button className="previous-button" onClick={handlePrevious}>Previous</button> */}
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="next-button" onClick={handleNext}>Next</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default AnnotationPage;
