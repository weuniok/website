/** @jsxImportSource react */

import { Line, OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { DoubleSide, Group, Matrix4, Mesh, Vector3 } from "three";

import { Axis } from "./meshes/Axis.react";
import { Planet } from "./meshes/Planet.react";
import { Rocket } from "./meshes/Rocket.react";

export const OrbitalElementsCanvas = ({
  elements,
}: {
  elements: OrbitalElements;
}) => {
  return (
    <Canvas
      camera={{ position: [-5, 5, 0], fov: 45 }}
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

// Orbit path visualization component
function OrbitPath({ elements }: { elements: OrbitalElements }) {
  const entireOrbitRef = useRef<Group>(null);
  const orbiterRef = useRef<Mesh>(null);

  const {
    semiMajorAxis,
    eccentricity,
    inclination,
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    trueAnomaly,
  } = elements;

  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
  const focusDistance = eccentricity * semiMajorAxis;
  const focalPosition = new Vector3(focusDistance, 0, 0);

  const rotMatrixPerigee = new Matrix4().makeRotationZ(argumentOfPeriapsis);
  const rotMatrixInclination = new Matrix4().makeRotationY(inclination);
  const rotMatrixAscending = new Matrix4().makeRotationZ(
    longitudeOfAscendingNode,
  );

  const orbiterPosition = useMemo(() => {
    const rotMatrixTrueAnomaly = new Matrix4().makeRotationZ(trueAnomaly);
    return new Vector3(1, 0, 0).applyMatrix4(rotMatrixTrueAnomaly);
  }, [trueAnomaly]);

  const rotMatrix = new Matrix4()
    .multiply(rotMatrixAscending)
    .multiply(rotMatrixInclination)
    .multiply(rotMatrixPerigee);
  const shiftVector = focalPosition.clone().applyMatrix4(rotMatrix);
  const planetPosition = focalPosition
    .clone()
    .multiplyScalar(1 / semiMajorAxis);

  useFrame(() => {
    if (entireOrbitRef.current) {
      entireOrbitRef.current.rotation.setFromRotationMatrix(rotMatrix);
    }
  });

  return (
    <group
      ref={entireOrbitRef}
      position={shiftVector.clone().multiplyScalar(-1)}
      scale={new Vector3(semiMajorAxis, semiMinorAxis, 1)}
    >
      {/* Orbit line*/}
      <mesh>
        <torusGeometry args={[1, 0.004, 16, 100]} />
        <meshBasicMaterial color="dodgerblue" />
      </mesh>
      {/* Orbit fill */}
      <mesh>
        <circleGeometry args={[1, 100]} />
        <meshStandardMaterial
          color="dodgerblue"
          side={DoubleSide}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Apoapsis-Periapsis line */}
      <Line
        points={[
          [1, 0, 0],
          [-1, 0, 0],
        ]}
        color={"royalblue"}
        lineWidth={2}
        dashSize={0.05}
        gapSize={0.05}
        dashed
      />

      {/* Orbiter */}
      <mesh
        position={orbiterPosition}
        ref={orbiterRef}
        scale={new Vector3(1 / semiMajorAxis, 1 / semiMinorAxis, 1)}
      >
        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial color="royalblue" />
            </mesh>
          }
        >
          <Rocket
            scale={[0.002, 0.002, 0.002]}
            rotation={[0, 0, trueAnomaly]}
          />
        </Suspense>
      </mesh>

      {/* Orbiter leading vector */}
      <Line
        points={[planetPosition, orbiterPosition]}
        color={"royalblue"}
        lineWidth={3}
      />
      {/* Apoapsis marker */}
      <mesh
        position={[-1.0, 0, 0]}
        scale={new Vector3(1 / semiMajorAxis, 1 / semiMinorAxis, 1)}
      >
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      {/* Periapsis marker */}
      <mesh
        position={[1.0, 0, 0]}
        scale={new Vector3(1 / semiMajorAxis, 1 / semiMinorAxis, 1)}
      >
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}
