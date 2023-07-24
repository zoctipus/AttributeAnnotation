import { useGLTF} from "@react-three/drei";
import { useState, useEffect} from "react";
import { Outline, EffectComposer } from "@react-three/postprocessing";
import { PivotControls } from "../../pivotControls/index";
import * as THREE from 'three'
import { useKeyPress } from 'react-use';
export default function LoadModel({
	pivotControlRef,
	hover, setHover,
	selectState,setSelectState,
	selection, setSelection,
	modelUrl}) {
	
  	const model = modelUrl ? useGLTF(modelUrl) : null;
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
	const euler = new THREE.Euler();

	const handleClick = (event) => {
		setSelectState("select");
		setSelection((selection) => {
			if (!selection[event.object.name]) {
				return {
					...selection,
					[event.object.name]: event.object,
				};
			}
			console.log(selection)
			return selection;
		});

		pivotControlRef.current = event.object;
		event.stopPropagation();
    };

    const calcRotation = (matrix) =>
    {
        matrix.decompose(position, quaternion, scale)
        euler.setFromQuaternion(quaternion, 'XYZ');
        return euler
    }

    const calcPosition = (matrix) =>
    {
        matrix.decompose(position, quaternion, scale)
        return position
	}
    
    

	return (
		<>
			<EffectComposer autoClear={0}>
				<Outline selection={hover ? [hover] : false} blur visibleEdgeColor="white" edgeStrength={100} width={1000} />
				<Outline
					selection={selection ? Object.values(selection) : false}
					blur
					visibleEdgeColor="green"
					edgeStrength={100}
					width={1000}
				/>
			</EffectComposer>
			{model && 
			<primitive 
				object={model.scene} 
				onPointerEnter={(event) => {
				setHover(event.object);
				event.stopPropagation();
				}}
				onPointerLeave={(event) => {
				setHover(null);
				}}
				onClick={(event) => {
				handleClick(event);
				}}>
			</primitive>
			}

            <PivotControls
                ref={pivotControlRef}
				visible={selectState === "select" ? true : false}
				object={pivotControlRef.current ? pivotControlRef.current : null}
				anchor={[0,0,0]}		
				lineWidth={1}
				// rotation={[0.5,0,0]}
			/>
		</>
	);
}
