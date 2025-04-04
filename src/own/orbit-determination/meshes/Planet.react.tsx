/** @jsxImportSource react */

import { useTexture } from "@react-three/drei";
import { type MeshProps } from "@react-three/fiber";
import { Suspense } from "react";

export const Planet = ({
  path,
  radius = 0.5,
  fallbackColor = "royalblue",
  ...meshProps
}: {
  path: string;
  radius?: number;
  fallbackColor?: string;
} & MeshProps) => {
  const planetMap = useTexture(path);

  return (
    <Suspense
      fallback={
        <mesh {...meshProps}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial color={fallbackColor} />
        </mesh>
      }
    >
      <mesh {...meshProps}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={planetMap} />
      </mesh>
    </Suspense>
  );
};
