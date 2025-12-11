/** @jsxImportSource react */

import { Line } from "@react-three/drei";
import * as THREE from "three";

export function LineOfSight({
  spacecraftPosition,
  telescopePosition,
}: {
  spacecraftPosition: THREE.Vector3;
  telescopePosition: THREE.Vector3;
}) {
  return (
    <Line
      points={[spacecraftPosition.toArray(), telescopePosition.toArray()]}
      color={"royalblue"}
      lineWidth={2}
      dashSize={0.05}
      gapSize={0.05}
      dashed
    />
  );
}
