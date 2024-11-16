/** @jsxImportSource react */

import { type MeshProps, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const Rocket = ({ ...props }: MeshProps) => {
  const gltf = useLoader(GLTFLoader, "/rocket.gltf");

  return (
    <mesh {...props}>
      <mesh position={[0, -50, 0]}>
        <primitive object={gltf.scene} />
      </mesh>
    </mesh>
  );
};
