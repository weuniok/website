/** @jsxImportSource react */

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  View,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import { Scene } from "./Scene.react";

const telescopePosition = new THREE.Vector3(0, 1, 1).normalize();
const spacecraftPosition = new THREE.Vector3(3, 3, 3);

export function TelescopeVisualiser() {
  const ref = useRef<HTMLDivElement | null>(null);

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
