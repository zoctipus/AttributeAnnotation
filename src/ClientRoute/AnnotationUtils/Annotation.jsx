import React, { useEffect, useState } from "react";
import "./ControlPanel.css";
import { initialAnnotation, getInputsConfig } from './AnnotationConfig';

function ControlPanel({ selection ,annotation, setAnnotation }) {
    const selections = Object.keys(selection);

    if (selections.length !== 1) return null;

    const [currentAnnotation, setCurrentAnnotation] = useState(annotation[selections[0]] || initialAnnotation);

    useEffect(() => {
        setAnnotation((prevAnnotation) => ({ ...prevAnnotation, [selections[0]]: currentAnnotation }));
    }, [currentAnnotation]);

    const handleChange = (property) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setCurrentAnnotation((prev) => ({ ...prev, [property]: value }));
    }



    const inputs = getInputsConfig(currentAnnotation);

    return (
        <div className="form-container">
            {inputs.map(([label, type, options, state]) => (
                <div className="control-group" key={label}>
                    <label>{label}:</label>
                    {type === 'select' ? (
                        <select value={currentAnnotation[label.toLowerCase()]} onChange={handleChange(label.toLowerCase())}>
                            {options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input type="checkbox" checked={currentAnnotation[label.toLowerCase()]} onChange={handleChange(label.toLowerCase())} />
                    )}
                </div>
            ))}
            

        </div>
    );
}

export default ControlPanel;
