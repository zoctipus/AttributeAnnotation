import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Outline, Selection, Select, EffectComposer } from "@react-three/postprocessing";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import LoadModel from "./LoadModel";

export default function Experience(props) {


	useFrame((state, delta) => {});

	return (
		<>
			<Perf position="top-left" />
			<OrbitControls makeDefault />
			<directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
			<ambientLight intensity={0.5} />
			<LoadModel {...props} />
		</>
	);
}
