/** @jsxImportSource react */

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { DoubleSide, Group, Matrix4, Mesh, Vector3 } from "three";

import { Rocket } from "./Rocket.react";

export function OrbitPath({ elements }: { elements: OrbitalElements }) {
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
