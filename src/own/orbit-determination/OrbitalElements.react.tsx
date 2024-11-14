/** @jsxImportSource react */

import {
  Line,
  OrbitControls,
  Plane,
  SoftShadows,
  Text,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { DoubleSide, Group, Mesh, Vector3 } from "three";

// Initial orbital elements
const initialOrbitalElements = {
  semiMajorAxis: 3,
  eccentricity: 0.5,
  inclination: Math.PI / 6, // 30 degrees in radians
  longitudeOfAscendingNode: Math.PI / 4,
  argumentOfPeriapsis: Math.PI / 3,
  trueAnomaly: 0,
};

type OrbitalElements = {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  trueAnomaly: number;
};

// Orbit path visualization component
function OrbitPath({ elements }: { elements: OrbitalElements }) {
  const meshRef = useRef<Group>(null);

  useFrame(() => {
    const {
      semiMajorAxis,
      eccentricity,
      inclination,
      longitudeOfAscendingNode,
      argumentOfPeriapsis,
      trueAnomaly,
    } = elements;

    // Calculate semi-minor axis and rotation based on orbital elements
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
    const tilt = new Vector3(
      longitudeOfAscendingNode,
      inclination,
      argumentOfPeriapsis,
    );

    // Update orbit path geometry and orientation
    if (meshRef.current) {
      meshRef.current.rotation.set(tilt.x - Math.PI / 2, tilt.y, tilt.z); // X axis shifted to align with XZ plane on 0
      meshRef.current.scale.set(semiMajorAxis, semiMinorAxis, 1);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshBasicMaterial color="dodgerblue" wireframe />
      </mesh>
      <Line
        points={[
          [0, -1, 0],
          [0, 1, 0],
        ]}
        color={"red"}
        lineWidth={2}
      />
      <Line
        points={[
          [1, 0, 0],
          [-1, 0, 0],
        ]}
        color={"royalblue"}
        lineWidth={2}
      />
    </group>
  );
}

export function OrbitalElementsVisualizer() {
  const [elements, setElements] = useState(initialOrbitalElements);

  return (
    <div style={{ width: "auto", maxWidth: "100%" }}>
      <ElementCanvas elements={elements} />
      <ElementsController elements={elements} setElements={setElements} />
    </div>
  );
}

const Planet = () => {
  const planetMap = useTexture("src/images/orbit-determination/2k_mars.jpg");

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial map={planetMap} />
    </mesh>
  );
};

const NoTexturePlanet = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ElementCanvas = ({ elements }: { elements: OrbitalElements }) => {
  return (
    <Canvas
      camera={{ position: [0, 10, 5], fov: 45 }}
      shadows
      style={{ height: "400px" }}
    >
      <SoftShadows samples={10} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

      {/* Orbit Path */}
      <OrbitPath elements={elements} />

      {/* Planet */}
      <Suspense fallback={<NoTexturePlanet />}>
        <Planet />
      </Suspense>

      <Plane
        args={[10, 10]}
        // receiveShadow
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial transparent opacity={0.3} side={DoubleSide} />
      </Plane>

      {/* Axes Helper */}
      <axesHelper args={[5]} />
      {/* Axis Labels */}
      <Text position={[6, 0, 0]} fontSize={0.5} color="red">
        X
      </Text>
      <Text position={[0, 6, 0]} fontSize={0.5} color="green">
        Y
      </Text>
      <Text position={[0, 0, 6]} fontSize={0.5} color="blue">
        Z
      </Text>

      <OrbitControls />
    </Canvas>
  );
};

const ElementsController = ({
  elements,
  setElements,
}: {
  elements: OrbitalElements;
  setElements: (elements: OrbitalElements) => void;
}) => {
  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <ElementSlider
        label="Semi-Major Axis"
        value={elements.semiMajorAxis}
        min={1}
        max={10}
        step={0.1}
        onChange={(value) => setElements({ ...elements, semiMajorAxis: value })}
      />

      <ElementSlider
        label="Eccentricity"
        value={elements.eccentricity}
        min={0}
        max={0.99}
        step={0.01}
        onChange={(value) => setElements({ ...elements, eccentricity: value })}
      />

      <ElementSlider
        label="Inclination"
        value={elements.inclination}
        min={0}
        max={Math.PI * 2}
        step={0.01}
        onChange={(value) => setElements({ ...elements, inclination: value })}
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="Longitude of Ascending Node"
        value={elements.longitudeOfAscendingNode}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) =>
          setElements({ ...elements, longitudeOfAscendingNode: value })
        }
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="Argument of Periapsis"
        value={elements.argumentOfPeriapsis}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) =>
          setElements({ ...elements, argumentOfPeriapsis: value })
        }
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />

      <ElementSlider
        label="True Anomaly"
        value={elements.trueAnomaly}
        min={0}
        max={2 * Math.PI}
        step={0.01}
        onChange={(value) => setElements({ ...elements, trueAnomaly: value })}
        formatDisplay={(value) => (value * (180 / Math.PI)).toFixed(0) + "°"}
      />
    </div>
  );
};

const ElementSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay = (value) => value.toFixed(2),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="font-bold">{label}:</label>
      <div className="flex w-1/2 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-7 w-full appearance-none rounded-full bg-gray-300 outline-none"
        />
        <b className="ml-2 w-16 text-center">{formatDisplay(value)}</b>
      </div>
    </div>
  );
};
