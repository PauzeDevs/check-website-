import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas=document.querySelector('#temple-canvas');
const host=canvas?.parentElement;
if(canvas&&host){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let renderer;
 try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.setSize(host.clientWidth,host.clientHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
 }catch(error){console.warn('WebGL is unavailable for the Temple Night scene.',error);}
 if(renderer){
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x050911);scene.fog=new THREE.FogExp2(0x0a1725,.045);
  const camera=new THREE.PerspectiveCamera(42,host.clientWidth/host.clientHeight,.1,100);
  camera.position.set(0,4.5,14);camera.lookAt(0,2,-2);
  scene.add(new THREE.HemisphereLight(0x9ac9ed,0x10121b,1.2));
  const moon=new THREE.DirectionalLight(0x91c9ff,2);moon.position.set(-5,10,4);scene.add(moon);
  const material=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
  const wood=material(0x171b24),roof=material(0x111b29,.65),trim=material(0x363b4b),stone=material(0x202a35);
  const glow=new THREE.MeshStandardMaterial({color:0xffa75c,emissive:0xff6a25,emissiveIntensity:2.2});
  function box(w,h,d,mat,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);scene.add(o);return o;}
  function beam(a,b,r,mat){const v=new THREE.Vector3().subVectors(b,a),o=new THREE.Mesh(new THREE.CylinderGeometry(r*.8,r,v.length(),7),mat);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());scene.add(o);}
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),material(0x0b131d,.3));floor.rotation.x=-Math.PI/2;floor.position.set(0,-.1,-12);scene.add(floor);
  // Procedural mountain layers form a misty forested backdrop.
  for(let layer=0;layer<4;layer++){
   const s=new THREE.Shape();s.moveTo(-22,-2);
   for(let i=0;i<=24;i++){const x=-22+i*44/24,y=1+Math.sin(i*1.3+layer)*1.2+Math.sin(i*.42+layer*2)*2+layer*.3;s.lineTo(x,y);}
   s.lineTo(22,-2);s.closePath();
   const mountain=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshBasicMaterial({color:[0x142130,0x101c2a,0x0c1724,0x08111b][layer],side:THREE.DoubleSide}));
   mountain.position.set(0,layer*.25,-19-layer*4);scene.add(mountain);
  }
  function pine(x,y,z,size){
   box(size*.12,size*.9,size*.12,material(0x111e2b),x,y+size*.35,z);
   for(let j=0;j<3;j++){const c=new THREE.Mesh(new THREE.ConeGeometry(size*(.34-j*.06),size*.5,7),material(0x122333));c.position.set(x,y+size*(.4+j*.2),z);scene.add(c);}
  }
  for(let i=0;i<55;i++)pine((Math.random()-.5)*38,0,-8-Math.random()*24,.8+Math.random()*2);
  // Main hall, layered eaves, ridge ornaments and a torii gate.
  box(7.2,.45,4.1,stone,0,1,-3.8);box(6.4,.2,3.5,trim,0,1.35,-3.8);box(5.8,1.7,2.6,wood,0,2.3,-3.8);
  for(const x of [-2.6,-1.3,1.3,2.6]){box(.2,2.1,.2,trim,x,2.5,-2.4);box(.2,2.1,.2,trim,x,2.5,-5);}
  box(6.5,.18,.3,trim,0,3.4,-2.4);box(6.5,.18,.3,trim,0,3.4,-5);
  for(let level=0;level<2;level++){
   const y=3.5+level*1.4,w=8-level*1.3,d=4.7-level*.6;
   box(w,.18,d,roof,0,y,-3.8);
   beam(new THREE.Vector3(-w*.57,y-.1,-3.8),new THREE.Vector3(0,y+.45,-3.8),.13,roof);
   beam(new THREE.Vector3(w*.57,y-.1,-3.8),new THREE.Vector3(0,y+.45,-3.8),.13,roof);
  }
  beam(new THREE.Vector3(0,5, -3.8),new THREE.Vector3(0,6,-3.8),.07,trim);
  for(let i=0;i<5;i++)beam(new THREE.Vector3(-.4+i*.2,5.1+i*.15,-3.8),new THREE.Vector3(.4-i*.2,5.1+i*.15,-3.8),.04,trim);
  for(const x of [-1.7,-.55,.55,1.7]){box(.42,.9,.04,glow,x,2.45,-2.42);for(let j=0;j<4;j++)box(.025,.86,.025,trim,x-.16+j*.11,2.45,-2.39);}
  for(const x of [-3.8,3.8]){box(.2,1.1,.2,wood,x,1,-1.4);box(.46,.45,.46,glow,x,1.75,-1.4);box(.5,.08,.5,trim,x,2,-1.4);const l=new THREE.PointLight(0xff9c4e,1.7,5);l.position.set(x,1.8,-1.4);scene.add(l);}
  for(const x of [-4.7,4.7])box(.28,4,.3,material(0x4a2928),x,2,-.1);
  box(10.7,.25,.45,material(0x5b3430),0,4,-.1);box(11.3,.17,.5,material(0x6b4037),0,4.22,-.1);box(8.8,.18,.4,material(0x482b2a),0,3.7,-.1);
  const mist=[];
  for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(14+Math.random()*8,1.4),new THREE.MeshBasicMaterial({color:0x83acc8,transparent:true,opacity:.065,depthWrite:false,side:THREE.DoubleSide}));m.position.set((Math.random()-.5)*12,.8+Math.random()*3,-1-Math.random()*14);scene.add(m);m.userData.speed=.1+Math.random()*.2;mist.push(m);}
  const count=900,positions=new Float32Array(count*6),speeds=new Float32Array(count);
  for(let i=0;i<count;i++){const x=(Math.random()-.5)*25,y=Math.random()*15,z=2-Math.random()*28;positions.set([x,y,z,x-.08,y-.35,z],i*6);speeds[i]=.08+Math.random()*.18;}
  const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  scene.add(new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:0xa5cbe7,transparent:true,opacity:.34})));
  const leaves=[];
  for(let i=0;i<24;i++){const leaf=new THREE.Mesh(new THREE.PlaneGeometry(.09,.16),new THREE.MeshBasicMaterial({color:i%2?0xc17a4b:0x6e9b86,side:THREE.DoubleSide,transparent:true,opacity:.8}));leaf.position.set((Math.random()-.5)*12,Math.random()*8-1,Math.random()*-12);leaf.userData={speed:.25+Math.random()*.4,phase:Math.random()*7};scene.add(leaf);leaves.push(leaf);}
  const target=new THREE.Vector2(),pointer=new THREE.Vector2(),wisps=[];
  for(let i=0;i<28;i++){const w=new THREE.Mesh(new THREE.SphereGeometry(.02,5,5),new THREE.MeshBasicMaterial({color:i%3?0x8bc9e9:0xffbb83,transparent:true,opacity:.42}));w.userData={phase:Math.random()*6.28,radius:.3+Math.random()*1.5};scene.add(w);wisps.push(w);}
  host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();target.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));},{passive:true});
  host.addEventListener('pointerleave',()=>target.set(0,0),{passive:true});
  let composer=null;try{composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(host.clientWidth,host.clientHeight),.48,.6,.72));}catch(e){console.warn('Bloom fallback enabled',e);}
  function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(composer)composer.setSize(w,h);}
  addEventListener('resize',resize,{passive:true});new ResizeObserver(resize).observe(host);
  const clock=new THREE.Clock();let frame=0,paused=false;
  function animate(){if(paused)return;frame=requestAnimationFrame(animate);const t=clock.getElapsedTime();pointer.lerp(target,.025);
   if(!reduced){camera.position.x=pointer.x*.38;camera.position.y=4.5+pointer.y*.18;camera.lookAt(pointer.x*.18,2,-2);
    mist.forEach(m=>{m.position.x+=m.userData.speed*.003;if(m.position.x>10)m.position.x=-10;m.material.opacity=.045+Math.sin(t*.4+m.position.z)*.02;});
    leaves.forEach(l=>{l.position.y-=l.userData.speed*.009;l.position.x+=Math.sin(t+l.userData.phase)*.002;l.rotation.z+=.003;if(l.position.y<-.8){l.position.y=7+Math.random()*2;l.position.x=(Math.random()-.5)*12;}});
    wisps.forEach(w=>{const p=w.userData.phase+t*.24;w.position.set(pointer.x*4+Math.cos(p)*w.userData.radius,2+pointer.y*1.8+Math.sin(p*1.3)*.5,-1-Math.sin(p)*2);});
    const a=rainGeometry.attributes.position.array;for(let i=0;i<count;i++){a[i*6+1]-=speeds[i];a[i*6+4]-=speeds[i];if(a[i*6+1]<-1){const y=12+Math.random()*3;a[i*6+1]=y;a[i*6+4]=y-.35;}}rainGeometry.attributes.position.needsUpdate=true;
   }
   if(composer)composer.render();else renderer.render(scene,camera);
  }
  document.addEventListener('visibilitychange',()=>{paused=document.hidden;if(!paused)animate();else cancelAnimationFrame(frame);});animate();
 }
}