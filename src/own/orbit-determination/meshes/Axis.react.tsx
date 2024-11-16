/** @jsxImportSource react */

import type { GroupProps } from "@react-three/fiber";

export const Axis = ({
  color,
  ...groupProps
}: { color: string } & GroupProps) => (
  <group {...groupProps}>
    {/* Axis line */}
    <mesh>
      <cylinderGeometry args={[0.02, 0.02, 5, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>

    {/* Arrowhead */}
    <mesh position={[0, 2.5, 0]}>
      <coneGeometry args={[0.1, 0.3, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);
