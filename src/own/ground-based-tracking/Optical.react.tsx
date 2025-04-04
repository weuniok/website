/** @jsxImportSource react */

import { useRef, useState, useEffect, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Plane,
  Html,
  Line,
  Center,
  View,
  Environment,
  MapControls,
  PivotControls,
  Bounds,
  useGLTF,
  PerspectiveCamera,
  OrthographicCamera,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { Planet } from "../orbit-determination/meshes/Planet.react";
import "./styles.css";

const matrix = new THREE.Matrix4();
const telescopePosition = new THREE.Vector3(0, 0, 1);
const spacecraftPosition = new THREE.Vector3(3, 3, 3);

function Spacecraft({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}

function Telescope({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
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

function Scene({ background = "white", ...props }) {
  return (
    <>
      <color attach="background" args={[background]} />
      <ambientLight />
      <directionalLight
        position={[10, 10, -15]}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={1024}
      />
      {/* <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} /> */}
      <group
        matrixAutoUpdate={false}
        // Why onUpdate and not just matrix={matrix} ?
        // This is an implementation detail, overwriting (most) transform objects isn't possible in Threejs
        // because they are defined read-only. Therefore Fiber will always call .copy() if you pass
        // an object, for instance matrix={new THREE.Matrix4()} or position={new THREE.Vector3()}
        // In this rare case we do not want it to copy the matrix, but refer to it.
        onUpdate={(self) => (self.matrix = matrix)}
        {...props}
      >
        {/* <Center> */}
        <OrbitControls />
        <Planet path={"/2k_mars.jpg"} fallbackColor="orange" />
        <Spacecraft position={spacecraftPosition} />
        <Telescope position={telescopePosition} />
        <LineOfSight
          spacecraftPosition={spacecraftPosition}
          telescopePosition={telescopePosition}
        />
        {/* <Stars /> */}
        {/* </Center> */}
      </group>
    </>
  );
}

// export function TelescopeVisualiser() {
//   const ref = useRef();
//   return (
//     <div style={{ width: "auto", maxWidth: "100%" }}>
//       <View>
//         <PivotControls scale={0.4} depthTest={false} matrix={matrix} />
//         <Scene background="aquamarine" matrix={matrix} />
//         <OrbitControls makeDefault />
//       </View>
//       <View>
//         <PivotControls
//           activeAxes={[true, true, false]}
//           depthTest={false}
//           matrix={matrix}
//         />
//         <Scene background="lightpink" matrix={matrix} />
//         <MapControls makeDefault screenSpacePanning enableRotate={false} />
//       </View>
//       <Canvas shadows eventSource={ref}>
//         {/** Each view tracks one of the divs above and creates a sandboxed environment that behaves
//              as if it were a normal everyday canvas, <View> will figure out the gl.scissor stuff alone. */}
//         {/* <View.Port /> */}
//         <Scene background="aquamarine" matrix={matrix} />
//       </Canvas>
//     </div>
//   );
// }

export function TelescopeVisualiser() {
  const ref = useRef();
  return (
    <div
      ref={ref}
      // style={{ width: "auto", maxWidth: "100%" }}
      className="container"
    >
      <Canvas eventSource={ref} className="canvas">
        <View.Port />
      </Canvas>
      <View index={1} className="view1">
        <color attach="background" args={["#f0f0f0"]} />
        <PerspectiveCamera makeDefault position={[-5, 5, 3]} fov={35} />
        <Lights />
        <Bounds fit clip observe margin={1.5}>
          <Scene />
        </Bounds>
        <ContactShadows
          frames={1}
          position={[0, -1, 0]}
          blur={1}
          opacity={0.6}
        />
        <OrbitControls makeDefault />
      </View>
      <View index={2} className="view2">
        <color attach="background" args={["#d6edf3"]} />
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={80} />
        <Lights />
        <OrbitControls makeDefault />
        <PivotControls depthTest={false}>
          <Bounds fit clip observe margin={1.5}>
            <Scene />
          </Bounds>
          <ContactShadows
            frames={1}
            position={[0, -1, 0]}
            blur={1}
            opacity={0.6}
          />
        </PivotControls>
      </View>
    </div>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[20, 30, 10]} />
      <pointLight position={[-10, -10, -10]} color="blue" />
    </>
  );
}
