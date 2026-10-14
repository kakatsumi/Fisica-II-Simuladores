import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { evaluate, axes } from './physics.js';
import { surfaces3D } from './contours.js';

const dispose = object => object.traverse(child => { child.geometry?.dispose(); if(child.material) for(const m of Array.isArray(child.material)?child.material:[child.material])m.dispose(); });
export default function View3D({ charges, point, showVectors, showContours, level, resetKey, path, particle }) {
  const container=useRef(null), active=useRef(null);
  const [error,setError]=useState('');
  const surfaces=useMemo(()=>showContours?surfaces3D(charges,[-level,0,level]):[],[charges,showContours,level]);
  useEffect(()=>{
    const host=container.current;
    let renderer;
    try { renderer=new THREE.WebGLRenderer({antialias:true}); } catch { setError('La vista 3D requiere WebGL2. Activa la aceleración gráfica o usa otro navegador compatible.'); return; }
    setError('');renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor('#f8fbff');host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label','Vista tridimensional interactiva del campo eléctrico');
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(45,1,.01,100);
    camera.position.set(5,4,6);
    const controls=new OrbitControls(camera,renderer.domElement);controls.minDistance=1;controls.maxDistance=20;controls.target.set(0,0,0);controls.update();
    const render=()=>renderer.render(scene,camera);
    controls.addEventListener('change',render);
    scene.add(new THREE.AmbientLight(0xffffff,2));
    const grid=new THREE.GridHelper(4,8,0x9db5d2,0xdce6f2);grid.rotation.x=Math.PI/2;scene.add(grid);
    scene.add(new THREE.AxesHelper(2.3));
    const box=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4,4,4)),new THREE.LineBasicMaterial({color:0xc7d7e9}));scene.add(box);
    for(const c of charges) {
      const ball=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),new THREE.MeshBasicMaterial({color:Number(c.q)>0?0xcb4053:Number(c.q)<0?0x2873cf:0x64748b}));
      ball.position.set(...axes.map(a=>Number(c[a])));scene.add(ball);
    }
    if(point.every(Number.isFinite)) {const marker=new THREE.Mesh(new THREE.OctahedronGeometry(.06),new THREE.MeshBasicMaterial({color:0x7456a0}));marker.position.set(...point);scene.add(marker);}
    if(showVectors) for(let z=-1.5;z<=1.51;z+=.75)for(let y=-1.5;y<=1.51;y+=.75)for(let x=-1.5;x<=1.51;x+=.75) {
      const r=evaluate(charges,[x,y,z],.12);if(r.error||r.magnitude<1e-10)continue;
      scene.add(new THREE.ArrowHelper(new THREE.Vector3(...r.direction),new THREE.Vector3(x,y,z),.18+.12*Math.min(1,Math.log10(1+r.magnitude)/3),0x528d85,.065,.035));
    }
    for(const surface of surfaces) {
      if(!surface.vertices.length)continue;
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(surface.vertices,3));geometry.computeVertexNormals();
      scene.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:surface.level>0?0xcb4e58:surface.level<0?0x4784d1:0x72808f,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false})));
    }
    const trajectory=new THREE.Group();scene.add(trajectory);
    const resize=()=>{const width=host.clientWidth;renderer.setSize(width,460);camera.aspect=width/460;camera.updateProjectionMatrix();render();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    active.current={trajectory,render};
    return ()=>{active.current=null;observer.disconnect();controls.dispose();dispose(scene);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
  },[charges,point,showVectors,showContours,level,resetKey,surfaces]);
  useEffect(()=>{
    const a=active.current;if(!a)return;
    for(const child of [...a.trajectory.children]){dispose(child);a.trajectory.remove(child);}
    if(path.length>1){const g=new THREE.BufferGeometry().setFromPoints(path.map(p=>new THREE.Vector3(...p)));a.trajectory.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:0xa36b13})));}
    if(particle){const ball=new THREE.Mesh(new THREE.SphereGeometry(.04,12,8),new THREE.MeshBasicMaterial({color:0xa36b13}));ball.position.set(...particle.slice(0,3));a.trajectory.add(ball);const velocity=new THREE.Vector3(...particle.slice(3));if(velocity.length()>1e-12)a.trajectory.add(new THREE.ArrowHelper(velocity.normalize(),ball.position,.3,0xa36b13));}
    a.render();
  },[path,particle,charges,point,showVectors,showContours,level,resetKey]);
  return <><div className="three-view" ref={container}/>{error&&<p role="alert" className="error">{error}</p>}</>;
}
