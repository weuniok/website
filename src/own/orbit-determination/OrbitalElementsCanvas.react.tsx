/** @jsxImportSource react */

import { OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Axis } from "./meshes/Axis.react";
import { Planet } from "./meshes/Planet.react";
import { OrbitPath } from "./meshes/OrbitPath.react";

export const OrbitalElementsCanvas = ({
  elements,
}: {
  elements: OrbitalElements;
}) => {
  return (
    <Canvas
      camera={{ position: [-5, 5, 3], fov: 45 }}
      shadows
      style={{ height: "400px" }}
    >
      <SoftShadows samples={10} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

      {/* Orbit Path */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <OrbitPath elements={elements} />
      </group>
      <Axis
        color="red"
        position={[0, 0, 0]}
        rotation={[0, -elements.longitudeOfAscendingNode, elements.inclination]}
      />

      {/* Planet */}
      <Planet path={"/2k_mars.jpg"} fallbackColor="orange" />

      {/* <Plane
        args={[100, 100]}
        receiveShadow
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial transparent opacity={0.2} side={DoubleSide} />
      </Plane> */}
      <gridHelper args={[20, 20]} />
      {/* <Axes /> */}

      <OrbitControls />
    </Canvas>
  );
};

// const Axes = () => {
//   return (
//     <group>
//       <axesHelper args={[5]} />
//       <Text position={[6, 0, 0]} fontSize={0.5} color="red">
//         X
//       </Text>
//       <Text position={[0, 6, 0]} fontSize={0.5} color="green">
//         Y
//       </Text>
//       <Text position={[0, 0, 6]} fontSize={0.5} color="blue">
//         Z
//       </Text>
//     </group>
//   );
// };
