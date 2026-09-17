  // --- Scroll-reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // --- Eye buddy: cursor-tracking eyes ---
  (function initEyeBuddy(){
    const eyes = document.querySelectorAll('#eyeBuddy .eye');
    if(!eyes.length) return;
    const irises = document.querySelectorAll('#eyeBuddy .iris');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const targets = Array.from(irises).map(() => ({ x: 0, y: 0, cx: 0, cy: 0 }));

    function setPointer(px, py){ mouseX = px; mouseY = py; }
    window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if(e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    const maxOffset = 6;
    function tick(){
      irises.forEach((iris, i) => {
        const rect = iris.parentElement.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const clamped = Math.min(dist, maxOffset);
        const targetX = (dx / dist) * clamped;
        const targetY = (dy / dist) * clamped;
        const t = targets[i];
        t.cx += (targetX - t.cx) * 0.25;
        t.cy += (targetY - t.cy) * 0.25;
        iris.style.transform = `translate(${t.cx}px, ${t.cy}px)`;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      function scheduleBlink(){
        const delay = 2600 + Math.random() * 2600;
        setTimeout(() => {
          eyes.forEach(eye => {
            eye.classList.add('blink');
            setTimeout(() => eye.classList.remove('blink'), 160);
          });
          scheduleBlink();
        }, delay);
      }
      scheduleBlink();
    }
  })();

  // --- Animated gradient: WebGL2 shader background ---
  (function initAnimatedGradient(){
    const canvas = document.getElementById('gradientCanvas');
    const hero = document.querySelector('.hero');
    if(!canvas || !hero) return;

    // Custom palette tuned to the site's dark/violet accents (ported from
    // an "Aurora"-style preset: near-black base, deep violet mid, vivid
    // violet highlight).
    const params = {
      color1: '#12172a',
      color2: '#2b1854',
      color3: '#8B5CF6',
      rotation: -45,
      proportion: 60,
      scale: 0.6,
      speed: 12,
      distortion: 35,
      swirl: 70,
      swirlIterations: 10,
      softness: 100,
      offset: 200,
      shape: 2,       // 0 = Checks, 1 = Stripes, 2 = Edge
      shapeSize: 50
    };

    function hexToRgba(hex){
      let r = 0, g = 0, b = 0, a = 1;
      if(hex.startsWith('#')){
        const c = hex.slice(1);
        if(c.length === 3){
          r = parseInt(c[0] + c[0], 16) / 255;
          g = parseInt(c[1] + c[1], 16) / 255;
          b = parseInt(c[2] + c[2], 16) / 255;
        } else if(c.length >= 6){
          r = parseInt(c.slice(0, 2), 16) / 255;
          g = parseInt(c.slice(2, 4), 16) / 255;
          b = parseInt(c.slice(4, 6), 16) / 255;
          if(c.length === 8) a = parseInt(c.slice(6, 8), 16) / 255;
        }
      }
      return [r, g, b, a];
    }

    let gl = null;
    try{
      gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true });
    }catch(err){ gl = null; }
    if(!gl) return; // graceful fallback: the hero keeps its plain dark background

    const vertexSrc = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

    const fragmentSrc = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;

uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
uniform vec2 u_mouse;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
    vec3 color1 = c1.rgb * c1.a;
    vec3 color2 = c2.rgb * c2.a;
    vec3 color3 = c3.rgb * c3.a;

    float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
    float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);

    vec3 blended_color_2 = mix(color1, color2, r1);
    float blended_opacity_2 = mix(c1.a, c2.a, r1);

    vec3 c = mix(blended_color_2, color3, r2);
    float o = mix(blended_opacity_2, c3.a, r2);
    return vec4(c, o);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 screenUv = uv;

    float t = .5 * u_time;

    float noise_scale = .0005 + .006 * u_scale;

    uv -= .5;
    uv *= (noise_scale * u_resolution);
    uv = rotate(uv, u_rotation * .5 * PI);
    uv /= u_pixelRatio;
    uv += .5;

    float n1 = noise(uv * 1. + t);
    float n2 = noise(uv * 2. - t);
    float angle = n1 * TWO_PI;
    uv.x += 4. * u_distortion * n2 * cos(angle);
    uv.y += 4. * u_distortion * n2 * sin(angle);

    float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
    for (float i = 1.; i <= iterations_number; i++) {
        uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
        uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
    }

    vec2 toMouse = screenUv - u_mouse;
    float distMouse = length(toMouse);
    float mouseFalloff = smoothstep(.45, 0., distMouse);
    uv += mouseFalloff * (u_distortion * .015) * normalize(toMouse + vec2(.0001));

    float proportion = clamp(u_proportion, 0., 1.);

    float shape = 0.;
    float mixer = 0.;
    if (u_shape < .5) {
      vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
      shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else if (u_shape < 1.5) {
      vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
      float f = fract(stripes_shape_uv.y);
      shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else {
      float sh = 1. - uv.y;
      sh -= .5;
      sh /= (noise_scale * u_resolution.y);
      sh += .5;
      float shape_scaling = .2 * (1. - u_shapeScale);
      shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
      mixer = shape;
    }

    vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);

    float glow = smoothstep(.35, 0., distMouse) * .45;
    vec3 finalRgb = color_mix.rgb + glow * u_color3.rgb;
    float finalAlpha = min(color_mix.a + glow * .35, 1.);

    fragColor = vec4(finalRgb, finalAlpha);
}
`;

    function compile(type, src){
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vShader = compile(gl.VERTEX_SHADER, vertexSrc);
    const fShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if(!vShader || !fShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
      u_scale: gl.getUniformLocation(program, 'u_scale'),
      u_rotation: gl.getUniformLocation(program, 'u_rotation'),
      u_color1: gl.getUniformLocation(program, 'u_color1'),
      u_color2: gl.getUniformLocation(program, 'u_color2'),
      u_color3: gl.getUniformLocation(program, 'u_color3'),
      u_proportion: gl.getUniformLocation(program, 'u_proportion'),
      u_softness: gl.getUniformLocation(program, 'u_softness'),
      u_shape: gl.getUniformLocation(program, 'u_shape'),
      u_shapeScale: gl.getUniformLocation(program, 'u_shapeScale'),
      u_distortion: gl.getUniformLocation(program, 'u_distortion'),
      u_swirl: gl.getUniformLocation(program, 'u_swirl'),
      u_swirlIterations: gl.getUniformLocation(program, 'u_swirlIterations'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse')
    };

    function resize(){
      const rect = hero.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const c1 = hexToRgba(params.color1);
    const c2 = hexToRgba(params.color2);
    const c3 = hexToRgba(params.color3);
    const startTime = performance.now();
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let mouseNX = 0.5, mouseNY = 0.5;
    function setPointer(px, py){
      const rect = hero.getBoundingClientRect();
      mouseNX = (px - rect.left) / rect.width;
      mouseNY = 1 - (py - rect.top) / rect.height; // flip: WebGL fragcoord is bottom-up
      if(isReducedMotion) renderFrame(startTime); // draw one frame reflecting the new cursor spot
    }
    window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if(e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function renderFrame(time){
      const elapsed = (time - startTime) / 1000;
      const speed = (params.speed / 100) * 5;

      gl.uniform1f(uniforms.u_time, elapsed * speed + params.offset * 0.01);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_pixelRatio, window.devicePixelRatio || 1);
      gl.uniform1f(uniforms.u_scale, params.scale);
      gl.uniform1f(uniforms.u_rotation, (params.rotation * Math.PI) / 180);
      gl.uniform4f(uniforms.u_color1, c1[0], c1[1], c1[2], c1[3]);
      gl.uniform4f(uniforms.u_color2, c2[0], c2[1], c2[2], c2[3]);
      gl.uniform4f(uniforms.u_color3, c3[0], c3[1], c3[2], c3[3]);
      gl.uniform1f(uniforms.u_proportion, params.proportion / 100);
      gl.uniform1f(uniforms.u_softness, params.softness / 100);
      gl.uniform1f(uniforms.u_shape, params.shape);
      gl.uniform1f(uniforms.u_shapeScale, params.shapeSize / 100);
      gl.uniform1f(uniforms.u_distortion, params.distortion / 50);
      gl.uniform1f(uniforms.u_swirl, params.swirl / 100);
      gl.uniform1f(uniforms.u_swirlIterations, params.swirl === 0 ? 0 : params.swirlIterations);
      gl.uniform2f(uniforms.u_mouse, mouseNX, mouseNY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    if(isReducedMotion){
      renderFrame(startTime); // single static frame, no continuous animation
    } else {
      (function loop(t){
        renderFrame(t);
        requestAnimationFrame(loop);
      })(startTime);
    }
  })();

  // --- Social wheel: draggable rotary list of social links ---
  (function initSocialWheel(){
    const stage = document.getElementById('wheelStage');
    const icon = document.getElementById('wheelIcon');
    if(!stage || !icon) return;

    const items = [
      { code: 'GH', label: 'GitHub',      url: '#', accent: 'var(--teal)' },
      { code: 'LI', label: 'LinkedIn',    url: '#', accent: 'var(--amber)' },
      { code: 'TW', label: 'Twitter / X', url: '#', accent: 'var(--dark-text-soft)' },
      { code: 'LC', label: 'LeetCode',    url: '#', accent: 'var(--amber)' },
      { code: 'DC', label: 'Discord',     url: '#', accent: 'var(--teal)' }
    ];
    const count = items.length;
    const spacing = 16;
    const radius = 70;
    const visible = 2;

    const els = items.map((item) => {
      const a = document.createElement('a');
      a.className = 'wheel-item';
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = item.label;
      a.setAttribute('role', 'option');
      stage.appendChild(a);
      return a;
    });

    let rotation = 0;
    let selected = 0;
    let velocity = 0;
    let dragging = false;
    let dragStartY = 0;
    let dragStartRotation = 0;
    let lastDragRotation = 0;
    let moved = false;
    let frame = null;

    function wrapIndex(i){ return ((i % count) + count) % count; }
    function shortestOffset(index, rot){
      let o = index - rot;
      while(o > count / 2) o -= count;
      while(o < -count / 2) o += count;
      return o;
    }

    function render(){
      els.forEach((el, i) => {
        const offset = shortestOffset(i, rotation);
        if(Math.abs(offset) > visible + 1){ el.style.display = 'none'; return; }
        el.style.display = '';
        const angle = offset * spacing;
        const rad = angle * Math.PI / 180;
        const x = -radius * (1 - Math.cos(rad));
        const y = radius * Math.sin(rad);
        const dist = Math.min(Math.abs(offset) / visible, 1);
        const opacity = Math.cos(dist * Math.PI / 2);
        const scale = 1 - Math.min(Math.abs(offset) * 0.06, 0.55);
        el.style.opacity = opacity;
        el.style.transform = `translate(${x}px, ${y}px) translateY(-50%) rotate(${angle}deg) scale(${scale})`;
        const isSel = Math.abs(offset) < 0.5;
        el.classList.toggle('selected', isSel);
        el.setAttribute('aria-selected', isSel ? 'true' : 'false');
      });
    }

    function setSelected(i){
      if(i === selected) return;
      selected = i;
      icon.textContent = items[i].code;
      icon.style.background = items[i].accent;
    }

    function commit(next){
      rotation = next;
      setSelected(wrapIndex(Math.round(rotation)));
      render();
    }

    function animate(){
      if(frame !== null) return;
      (function tick(){
        let keep = false;
        if(!dragging && Math.abs(velocity) > 0.001){
          commit(rotation + velocity);
          velocity *= 0.9;
          keep = true;
        } else if(!dragging){
          velocity = 0;
          const target = Math.round(rotation);
          const delta = target - rotation;
          if(Math.abs(delta) > 0.001){
            commit(rotation + delta * 0.25);
            keep = true;
          } else {
            commit(target);
          }
        }
        frame = keep ? requestAnimationFrame(tick) : null;
      })();
    }

    stage.addEventListener('pointerdown', (e) => {
      dragging = true; moved = false;
      dragStartY = e.clientY;
      dragStartRotation = rotation;
      lastDragRotation = rotation;
      velocity = 0;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
      if(!dragging) return;
      const dy = e.clientY - dragStartY;
      if(Math.abs(dy) > 4) moved = true;
      const next = dragStartRotation - dy * 0.025;
      velocity = next - lastDragRotation;
      lastDragRotation = next;
      commit(next);
    });
    function endDrag(){
      if(!dragging) return;
      dragging = false;
      animate();
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.01;
      commit(rotation + delta);
      velocity = delta * 0.2;
      animate();
    }, { passive: false });

    stage.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){
        e.preventDefault(); velocity = 0; commit(rotation + 1); animate();
      }
      if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
        e.preventDefault(); velocity = 0; commit(rotation - 1); animate();
      }
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        window.open(items[selected].url, '_blank', 'noopener');
      }
    });

    els.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        if(moved){ e.preventDefault(); return; }
        velocity = 0;
        commit(rotation + shortestOffset(i, rotation));
        animate();
      });
    });

    icon.style.background = items[0].accent;
    render();
  })();

  // --- Nav solid-on-scroll ---
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.7);
  });

  // --- Terminal typing sequence ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const term = document.getElementById('terminal');
  const scrollCue = document.getElementById('scrollCue');

  const sequence = [
    { p: '$ whoami', o: null },
    { p: null, o: 'Adithyan', big: true },
    { p: '$ role --current', o: null },
    { p: null, o: 'BCA Student', role: true },
    { p: '$ status', o: 'available for internships & collab' }
  ];

  function renderInstant(){
    term.innerHTML = `
      <p class="line"><span class="prompt">$</span>whoami</p>
      <h1>Adithyan<span class="cursor"></span></h1>
      <p class="role">BCA Student</p>
      <p class="line"><span class="prompt">$</span>status<br><span class="out">available for internships &amp; collab</span></p>
    `;
    scrollCue.classList.add('show');
  }

  function typeLine(el, text, speed, cb){
    let i = 0;
    (function step(){
      el.textContent += text[i];
      i++;
      if(i < text.length){ setTimeout(step, speed); }
      else if(cb){ cb(); }
    })();
  }

  function runSequence(){
    const p1 = document.createElement('p');
    p1.className = 'line';
    term.appendChild(p1);
    const prompt1 = document.createElement('span');
    prompt1.className = 'prompt'; prompt1.textContent = '$';
    p1.appendChild(prompt1);
    const cmd1 = document.createElement('span');
    p1.appendChild(cmd1);

    typeLine(cmd1, 'whoami', 45, () => {
      setTimeout(() => {
        const h1 = document.createElement('h1');
        term.appendChild(h1);
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        typeLine(h1, 'Adithyan', 70, () => {
          h1.appendChild(cursor);
          setTimeout(() => {
            const role = document.createElement('p');
            role.className = 'role';
            term.appendChild(role);
            typeLine(role, 'BCA Student', 40, () => {
              setTimeout(() => {
                const p2 = document.createElement('p');
                p2.className = 'line';
                term.appendChild(p2);
                const prompt2 = document.createElement('span');
                prompt2.className = 'prompt'; prompt2.textContent = '$';
                p2.appendChild(prompt2);
                const cmd2 = document.createElement('span');
                p2.appendChild(cmd2);
                typeLine(cmd2, 'status', 45, () => {
                  setTimeout(() => {
                    const out = document.createElement('p');
                    out.className = 'line out';
                    out.style.marginTop = '2px';
                    term.appendChild(out);
                    typeLine(out, 'available for internships & collab', 22, () => {
                      scrollCue.classList.add('show');
                    });
                  }, 150);
                });
              }, 200);
            });
          }, 150);
        });
      }, 250);
    });
  }

  if(reduceMotion){ renderInstant(); } else { runSequence(); }

  // --- Skill filter ---
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.card');
  const hint = document.getElementById('filterHint');
  let active = null;

  function applyFilter(){
    if(!active){
      cards.forEach(c => c.classList.remove('hide'));
      hint.innerHTML = '';
      return;
    }
    cards.forEach(c => {
      const skills = (c.dataset.skills || '').split(',');
      c.classList.toggle('hide', !skills.includes(active));
    });
    hint.innerHTML = `Showing projects using <strong>${active}</strong> — <button id="clearFilter">clear</button>`;
    const clearBtn = document.getElementById('clearFilter');
    if(clearBtn){
      clearBtn.addEventListener('click', () => {
        active = null;
        chips.forEach(ch => ch.classList.remove('active'));
        applyFilter();
        document.getElementById('projects').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
      });
    }
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const skill = chip.dataset.skill;
      if(active === skill){
        active = null;
        chip.classList.remove('active');
      } else {
        active = skill;
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      }
      applyFilter();
      if(active){
        document.getElementById('projects').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
      }
    });
  });

  // --- Card flip (tap/click or keyboard) ---
  const FLIP_MS = 650;
  function toggleFlip(card){
    card.classList.add('flipping');
    card.style.transform = '';
    card.classList.toggle('open');
    setTimeout(() => card.classList.remove('flipping'), FLIP_MS);
  }
  cards.forEach(card => {
    card.addEventListener('click', () => toggleFlip(card));
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleFlip(card);
      }
    });
  });

  // --- Subtle 3D tilt on hover (fine-pointer devices only) ---
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion;
  if(canTilt){
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if(card.classList.contains('flipping')) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 14;
        const rotateX = y * -14;
        card.style.transform = `perspective(1300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        if(card.classList.contains('flipping')) return;
        card.style.transform = '';
      });
    });
  }

  // --- Copy email ---
  const copyBtn = document.getElementById('copyEmail');
  const copyNote = document.getElementById('copyNote');
  const email = 'adithyan.example@email.com';
  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(email);
      copyNote.textContent = `Copied: ${email}`;
    }catch(err){
      copyNote.textContent = email;
    }
  });

