// ControlPanelConfig.js
export const initialAnnotation = { elasticity: "a", deformation: "a", texture: "a", affordance: true, joint: "fixed" };

const options = ["a", "b", "c"];

const jointOptions = ["Fixed", "Spherical", "Revolute", "Slider"];

export const getInputsConfig = (currentAnnotation) => {
    const inputs = [
        ['Elasticity', 'select', options, currentAnnotation.elasticity],
        ['Deformation', 'select', options, currentAnnotation.deformation],
        ['Texture', 'select', options, currentAnnotation.texture],
        ['Affordance', 'checkbox', null, currentAnnotation.affordance]
    ];
    
    if (currentAnnotation.affordance) {
        inputs.push(['Joint', 'select', jointOptions, currentAnnotation.joint]);
    }
    
    return inputs;
}
