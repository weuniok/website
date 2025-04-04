/** @jsxImportSource react */

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Line,
  Center,
  View,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "../orbit-determination/meshes/Planet.react";
import "./styles.css";
import { Rocket } from "../orbit-determination/meshes/Rocket.react";

function Telescope({
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

function LineOfSight({
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

function Scene({
  telescopePosition,
  spacecraftPosition,
  ...props
}: {
  telescopePosition: THREE.Vector3;
  spacecraftPosition: THREE.Vector3;
  [key: string]: any;
}) {
  return (
    <>
      <group>
        <Planet path={"/2k_mars.jpg"} fallbackColor="orange" radius={1} />
        {/* <Target/> */}
        <Telescope
          position={telescopePosition}
          lookAtPosition={spacecraftPosition}
        />
        <Rocket
          scale={[0.002, 0.002, 0.002]}
          rotation={[0, 0, 0]}
          position={spacecraftPosition}
        />
        <LineOfSight
          spacecraftPosition={spacecraftPosition}
          telescopePosition={telescopePosition}
        />
        <LineOfSight
          spacecraftPosition={spacecraftPosition}
          telescopePosition={new THREE.Vector3(0, 0, 0)}
        />
      </group>
    </>
  );
}

export function TelescopeVisualiser() {
  const ref = useRef<HTMLDivElement | null>(null);

  const telescopePosition = new THREE.Vector3(0, 1, 1).normalize();
  const spacecraftPosition = new THREE.Vector3(3, 3, 3);

  return (
    <div ref={ref} className="container">
      <Canvas
        eventSource={ref.current as HTMLElement}
        className="canvas"
        shadows
      >
        <View.Port />
      </Canvas>

      <View index={1} className="view1">
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <PerspectiveCamera makeDefault position={[-5, 5, 3]} fov={35} />
        <Center>
          <Scene
            telescopePosition={telescopePosition}
            spacecraftPosition={spacecraftPosition}
          />
        </Center>
        <OrbitControls makeDefault />
      </View>
      <View index={2} className="view2">
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <PerspectiveCamera position={telescopePosition} makeDefault />
        <Scene
          telescopePosition={telescopePosition}
          spacecraftPosition={spacecraftPosition}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          enableDamping={false}
          target={spacecraftPosition}
        />
      </View>
    </div>
  );
}
