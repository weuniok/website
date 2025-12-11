/** @jsxImportSource react */

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function Telescope({
  position,
  lookAtPosition,
}: {
  position: THREE.Vector3;
  lookAtPosition: THREE.Vector3;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.lookAt(lookAtPosition);
      ref.current.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * -0.5);
    }
  }, [position]);

  return (
    <mesh ref={ref} position={position}>
      <coneGeometry args={[0.2, 0.5, 32]} />
      <meshBasicMaterial color="green" />
    </mesh>
  );
}
