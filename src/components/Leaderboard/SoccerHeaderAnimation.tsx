import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const createSoccerTexture = () => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const drawPentagon = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  ctx.fillStyle = '#1a1a1a';
  const center = size / 2;
  drawPentagon(center, center, 65);
  const outerRadius = 160;
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    drawPentagon(center + Math.cos(angle) * outerRadius, center + Math.sin(angle) * outerRadius, 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
};

const createEmojiTexture = (emoji: string) => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.font = '90px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const createGrassTexture = () => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = '#2d8a4e';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#34a058';
  for (let i = 0; i < size; i += 40) {
    ctx.fillRect(i, 0, 20, size);
  }

  ctx.strokeStyle = '#23733d';
  ctx.lineWidth = 1;
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 5 - Math.random() * 5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
};

interface Target {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  hit: boolean;
  hitTime: number;
  originalY: number;
}

const SoccerHeaderAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const rootWindow = container.ownerDocument.defaultView;
    if (!rootWindow) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87ceeb, 10, 30);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(rootWindow.devicePixelRatio, 2));
    renderer.setClearColor(0x87ceeb);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(ambientLight, sunLight);

    // Grass
    const grassTexture = createGrassTexture();
    const grassGeometry = new THREE.PlaneGeometry(30, 20);
    const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 0.9 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);

    // Goal setup
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
    const goalWidth = 5;
    const goalHeight = 2.5;
    const postRadius = 0.08;
    const goalDepth = 1.5;
    const goalZ = -3;

    const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, goalHeight, 16);
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-goalWidth / 2, goalHeight / 2, goalZ);
    leftPost.castShadow = true;
    scene.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(goalWidth / 2, goalHeight / 2, goalZ);
    rightPost.castShadow = true;
    scene.add(rightPost);

    const crossbarGeometry = new THREE.CylinderGeometry(postRadius, postRadius, goalWidth + postRadius * 2, 16);
    const crossbar = new THREE.Mesh(crossbarGeometry, postMaterial);
    crossbar.position.set(0, goalHeight, goalZ);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.castShadow = true;
    scene.add(crossbar);

    const backPostGeometry = new THREE.CylinderGeometry(postRadius * 0.7, postRadius * 0.7, goalHeight, 12);
    const leftBackPost = new THREE.Mesh(backPostGeometry, postMaterial);
    leftBackPost.position.set(-goalWidth / 2, goalHeight / 2, goalZ - goalDepth);
    scene.add(leftBackPost);

    const rightBackPost = new THREE.Mesh(backPostGeometry, postMaterial);
    rightBackPost.position.set(goalWidth / 2, goalHeight / 2, goalZ - goalDepth);
    scene.add(rightBackPost);

    const backCrossbarGeometry = new THREE.CylinderGeometry(postRadius * 0.7, postRadius * 0.7, goalWidth, 12);
    const backCrossbar = new THREE.Mesh(backCrossbarGeometry, postMaterial);
    backCrossbar.position.set(0, goalHeight, goalZ - goalDepth);
    backCrossbar.rotation.z = Math.PI / 2;
    scene.add(backCrossbar);

    // Net
    const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const netGroup = new THREE.Group();
    const netSpacing = 0.25;

    for (let x = -goalWidth / 2; x <= goalWidth / 2; x += netSpacing) {
      const points = [new THREE.Vector3(x, 0, goalZ - goalDepth), new THREE.Vector3(x, goalHeight, goalZ - goalDepth)];
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), netMaterial));
    }
    for (let y = 0; y <= goalHeight; y += netSpacing) {
      const points = [new THREE.Vector3(-goalWidth / 2, y, goalZ - goalDepth), new THREE.Vector3(goalWidth / 2, y, goalZ - goalDepth)];
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), netMaterial));
    }
    for (let z = goalZ; z >= goalZ - goalDepth; z -= netSpacing) {
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-goalWidth / 2, 0, z), new THREE.Vector3(-goalWidth / 2, goalHeight, z)]), netMaterial));
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(goalWidth / 2, 0, z), new THREE.Vector3(goalWidth / 2, goalHeight, z)]), netMaterial));
    }
    for (let y = 0; y <= goalHeight; y += netSpacing) {
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-goalWidth / 2, y, goalZ), new THREE.Vector3(-goalWidth / 2, y, goalZ - goalDepth)]), netMaterial));
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(goalWidth / 2, y, goalZ), new THREE.Vector3(goalWidth / 2, y, goalZ - goalDepth)]), netMaterial));
    }
    for (let x = -goalWidth / 2; x <= goalWidth / 2; x += netSpacing) {
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, goalHeight, goalZ), new THREE.Vector3(x, goalHeight, goalZ - goalDepth)]), netMaterial));
    }
    for (let z = goalZ; z >= goalZ - goalDepth; z -= netSpacing) {
      netGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-goalWidth / 2, goalHeight, z), new THREE.Vector3(goalWidth / 2, goalHeight, z)]), netMaterial));
    }
    scene.add(netGroup);

    // Targets in the goal
    const targets: Target[] = [];
    const targetPositions = [
      new THREE.Vector3(-1.8, 2.0, goalZ + 0.1),   // Top left
      new THREE.Vector3(1.8, 2.0, goalZ + 0.1),    // Top right
      new THREE.Vector3(-1.8, 0.6, goalZ + 0.1),   // Bottom left
      new THREE.Vector3(1.8, 0.6, goalZ + 0.1),    // Bottom right
      new THREE.Vector3(0, 1.8, goalZ + 0.1),      // Top center
    ];

    const targetGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
    const targetMaterialNormal = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.5, metalness: 0.2 });
    const targetMaterialHit = new THREE.MeshStandardMaterial({ color: 0x33ff33, roughness: 0.5, metalness: 0.2, emissive: 0x115511, emissiveIntensity: 0.5 });

    targetPositions.forEach((pos) => {
      const mesh = new THREE.Mesh(targetGeometry, targetMaterialNormal.clone());
      mesh.position.copy(pos);
      mesh.rotation.x = Math.PI / 2;
      mesh.castShadow = true;
      scene.add(mesh);
      targets.push({ mesh, position: pos.clone(), hit: false, hitTime: 0, originalY: pos.y });
    });

    // Aiming reticle (shows where you're aiming)
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.rotation.x = Math.PI / 2;
    scene.add(reticle);

    // Crying emoji sprite for misses
    const cryingTexture = createEmojiTexture('😭');
    const cryingMaterial = new THREE.SpriteMaterial({ map: cryingTexture, transparent: true, opacity: 0 });
    const cryingSprite = new THREE.Sprite(cryingMaterial);
    cryingSprite.scale.set(1.2, 1.2, 1);
    cryingSprite.position.set(0, 1.5, goalZ + 0.5);
    scene.add(cryingSprite);
    let cryingTimer = 0;

    // Soccer ball
    const ballTexture = createSoccerTexture();
    const ballGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ map: ballTexture, roughness: 0.4, metalness: 0 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    scene.add(ball);

    // Ball state
    let ballState: 'ready' | 'shooting' | 'resetting' = 'ready';
    let ballProgress = 0;
    const ballStart = new THREE.Vector3(0, 0.35, 4);
    const ballTarget = new THREE.Vector3(0, 1.5, goalZ);
    let ballSpinSpeed = 0;
    const aimTarget = new THREE.Vector3(0, 1.5, goalZ);
    let hitAnyTarget = false;

    ball.position.copy(ballStart);

    // Raycaster for aiming
    const raycaster = new THREE.Raycaster();
    const aimPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -goalZ);
    const pointer = new THREE.Vector2(0, 0);
    const pointerWorld = new THREE.Vector3();

    const updateAim = () => {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(aimPlane, pointerWorld);
      
      // Clamp to goal area
      aimTarget.x = THREE.MathUtils.clamp(pointerWorld.x, -goalWidth / 2 + 0.3, goalWidth / 2 - 0.3);
      aimTarget.y = THREE.MathUtils.clamp(pointerWorld.y, 0.3, goalHeight - 0.3);
      aimTarget.z = goalZ;

      // Update reticle position
      reticle.position.set(aimTarget.x, aimTarget.y, goalZ + 0.15);
      reticle.rotation.y = 0;
    };

    const shootBall = () => {
      if (ballState !== 'ready') return;
      ballState = 'shooting';
      ballProgress = 0;
      ballTarget.copy(aimTarget);
      ballSpinSpeed = 12;
      hitAnyTarget = false;
    };

    const resetBall = () => {
      ballState = 'resetting';
      ballProgress = 0;
    };

    // Check collision with targets
    const checkTargetHit = () => {
      const ballPos = ball.position;
      targets.forEach((target) => {
        if (target.hit) return;
        const dist = ballPos.distanceTo(target.position);
        if (dist < 0.5) {
          target.hit = true;
          target.hitTime = 0;
          hitAnyTarget = true;
          (target.mesh.material as THREE.MeshStandardMaterial).copy(targetMaterialHit);
        }
      });
    };

    // Input handlers
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const handleClick = () => {
      if (ballState === 'ready') {
        shootBall();
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    // Resize
    const resize = () => {
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 225;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof rootWindow.ResizeObserver !== 'undefined') {
      resizeObserver = new rootWindow.ResizeObserver(resize);
      resizeObserver.observe(container);
    } else {
      rootWindow.addEventListener('resize', resize);
    }

    // Animation
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      updateAim();

      // Ball animation
      if (ballState === 'ready') {
        ball.position.y = ballStart.y + Math.sin(elapsed * 3) * 0.03;
        ball.rotation.y += delta * 0.5;
        
        // Reticle pulse
        const pulse = 1 + Math.sin(elapsed * 4) * 0.1;
        reticle.scale.setScalar(pulse);
        reticle.visible = true;
      } else if (ballState === 'shooting') {
        ballProgress += delta * 2;
        if (ballProgress >= 1) {
          ballProgress = 1;
          ballState = 'resetting';
          
          // Show crying emoji if missed all targets
          if (!hitAnyTarget) {
            cryingTimer = 2;
            cryingSprite.position.set(ballTarget.x, ballTarget.y, goalZ + 0.5);
          }
          
          setTimeout(() => {
            if (ballState === 'resetting') {
              ball.position.copy(ballStart);
              ballState = 'ready';
            }
          }, 800);
        }

        const t = ballProgress;
        const arcHeight = 2 * Math.sin(t * Math.PI) * (1 - t * 0.5);
        ball.position.lerpVectors(ballStart, ballTarget, t);
        ball.position.y += arcHeight;

        ball.rotation.x += ballSpinSpeed * delta;
        ball.rotation.z += ballSpinSpeed * 0.4 * delta;
        ballSpinSpeed = Math.max(1, ballSpinSpeed - delta * 5);

        checkTargetHit();
        reticle.visible = false;
      } else if (ballState === 'resetting') {
        ball.rotation.x += ballSpinSpeed * delta * 0.3;
        ballSpinSpeed = Math.max(0, ballSpinSpeed - delta * 4);
        reticle.visible = false;
      }

      // Animate hit targets
      targets.forEach((target) => {
        if (target.hit) {
          target.hitTime += delta;
          // Wobble and fall animation
          const fallProgress = Math.min(target.hitTime * 2, 1);
          target.mesh.rotation.x = Math.PI / 2 + fallProgress * Math.PI * 0.4;
          target.mesh.position.y = target.originalY - fallProgress * 0.3;
          
          // Reset after a while
          if (target.hitTime > 3) {
            target.hit = false;
            target.mesh.rotation.x = Math.PI / 2;
            target.mesh.position.y = target.originalY;
            (target.mesh.material as THREE.MeshStandardMaterial).copy(targetMaterialNormal);
          }
        }
      });

      // Crying emoji animation
      if (cryingTimer > 0) {
        cryingTimer -= delta;
        // Fade in quickly, stay visible, fade out
        if (cryingTimer > 1.7) {
          cryingMaterial.opacity = (2 - cryingTimer) / 0.3; // Fade in
        } else if (cryingTimer < 0.3) {
          cryingMaterial.opacity = cryingTimer / 0.3; // Fade out
        } else {
          cryingMaterial.opacity = 1;
        }
        // Gentle bob animation
        cryingSprite.position.y += Math.sin(elapsed * 5) * 0.002;
      } else {
        cryingMaterial.opacity = 0;
      }

      // Camera subtle sway
      camera.position.x = pointer.x * 0.5;
      camera.position.y = 2 - pointer.y * 0.3;
      camera.lookAt(0, 1.2, goalZ);

      renderer.render(scene, camera);
      frameId = rootWindow.requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      rootWindow.cancelAnimationFrame(frameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);
      if (resizeObserver) resizeObserver.disconnect();
      else rootWindow.removeEventListener('resize', resize);

      ballGeometry.dispose();
      ballMaterial.dispose();
      ballTexture.dispose();
      grassGeometry.dispose();
      grassMaterial.dispose();
      grassTexture.dispose();
      postGeometry.dispose();
      crossbarGeometry.dispose();
      backPostGeometry.dispose();
      backCrossbarGeometry.dispose();
      postMaterial.dispose();
      netMaterial.dispose();
      targetGeometry.dispose();
      targetMaterialNormal.dispose();
      targetMaterialHit.dispose();
      reticleGeometry.dispose();
      reticleMaterial.dispose();
      cryingTexture.dispose();
      cryingMaterial.dispose();
      targets.forEach((t) => (t.mesh.material as THREE.Material).dispose());
      netGroup.traverse((obj) => {
        if (obj instanceof THREE.Line) obj.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="leaderboard-header-animation" ref={containerRef} />;
};

export default SoccerHeaderAnimation;
