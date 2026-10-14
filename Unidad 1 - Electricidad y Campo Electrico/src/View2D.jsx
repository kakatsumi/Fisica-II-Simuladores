import React, { useEffect, useMemo, useRef } from 'react';
import { evaluate } from './physics.js';
import { contours2D, fieldLines2D } from './contours.js';

export default function View2D({ charges, point, showLines, showVectors, showContours, level, path, particle, onPoint }) {
  const ref = useRef(null);
  const contours = useMemo(() => showContours ? contours2D(charges, [-level, 0, level]) : [], [charges, showContours, level]);
  const lines = useMemo(() => showLines ? fieldLines2D(charges) : [], [charges, showLines]);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d');
    const w = 700, h = 520, scale = 112, ox = w/2, oy = h/2;
    const xy = p => [ox + p[0]*scale, oy - p[1]*scale];
    const strokePath = (points, color, width = 1) => {
      if (points.length < 2) return;
      ctx.beginPath(); points.forEach((p,i) => { const [x,y] = xy(p); if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
    };
    const arrow = (a, b, color) => {
      const [x,y] = xy(a), [u,v] = xy(b), angle = Math.atan2(v-y,u-x);
      strokePath([a,b], color, 1.3);
      ctx.beginPath(); ctx.moveTo(u,v); ctx.lineTo(u-6*Math.cos(angle-.5),v-6*Math.sin(angle-.5)); ctx.lineTo(u-6*Math.cos(angle+.5),v-6*Math.sin(angle+.5)); ctx.closePath(); ctx.fillStyle=color; ctx.fill();
    };
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#f8fbff'; ctx.fillRect(0,0,w,h);
    for (let i=-2; i<=2.001; i+=.5) { strokePath([[i,-2,0],[i,2,0]],'#e0e9f4'); strokePath([[-2,i,0],[2,i,0]],'#e0e9f4'); }
    strokePath([[-2,0,0],[2,0,0]],'#aabed8'); strokePath([[0,-2,0],[0,2,0]],'#aabed8');
    ctx.fillStyle='#59708d'; ctx.font='12px system-ui';
    for (let i=-2; i<=2; i++) { ctx.fillText(`${i}`,ox+i*scale-6,oy+18); if(i!==0)ctx.fillText(`${i}`,ox+8,oy-i*scale+4); }
    ctx.fillText('x (m)',ox+2*scale+12,oy+4); ctx.fillText('y (m)',ox+8,oy-2*scale-12);
    for (const contour of contours) for (const segment of contour.segments) strokePath(segment, contour.level>0?'#cb4e58':contour.level<0?'#4784d1':'#72808f', 1.3);
    if (showVectors) for (let y=-1.8; y<=1.81; y+=.4) for (let x=-1.8; x<=1.81; x+=.4) {
      const r=evaluate(charges,[x,y,0],.12); if(r.error)continue;
      const norm=Math.hypot(r.field[0],r.field[1]); if(norm<1e-10)continue;
      const size=.13 + .07 * Math.min(1,Math.log10(1+norm)/3);
      arrow([x,y,0],[x+size*r.field[0]/norm,y+size*r.field[1]/norm,0],'#528d85');
    }
    for (const line of lines) {
      strokePath(line,'#749caf',1);
      for(let i=10;i<line.length;i+=40) arrow(line[i],line[Math.min(i+3,line.length-1)],'#4e829a');
    }
    for (const c of charges) {
      const [x,y]=xy([Number(c.x),Number(c.y)]);
      ctx.beginPath();ctx.arc(x,y,10,0,2*Math.PI);ctx.fillStyle=Number(c.q)>0?'#cb4053':Number(c.q)<0?'#2873cf':'#64748b';ctx.fill();
      ctx.fillStyle='white';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText(Number(c.q)>0?'+':Number(c.q)<0?'−':'0',x,y+5);
      ctx.fillStyle='#203e63';ctx.font='12px system-ui';ctx.fillText(`q${c.id}${Number(c.z)!==0?' (z='+c.z+')':''}`,x,y-17);ctx.textAlign='left';
    }
    if (point.every(Number.isFinite)) { const [x,y]=xy(point); ctx.strokeStyle='#7456a0';ctx.lineWidth=2;ctx.strokeRect(x-4,y-4,8,8); }
    strokePath(path,'#a36b13',2.4);
    if(particle) {
      const [x,y]=xy(particle);ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.fillStyle='#a36b13';ctx.fill();
      const speed=Math.hypot(particle[3],particle[4]);
      if(speed>1e-12) arrow(particle, [particle[0]+.2*particle[3]/speed,particle[1]+.2*particle[4]/speed,particle[2]],'#a36b13');
    }
  },[charges,point,showVectors,lines,contours,path,particle]);
  return <canvas ref={ref} width="700" height="520" aria-label="Campo eléctrico en el plano z igual a cero. Las cargas fuera del plano se proyectan." onClick={event=>{const r=ref.current.getBoundingClientRect();const x=(event.clientX-r.left)*700/r.width,y=(event.clientY-r.top)*520/r.height;const p=[(x-350)/112,(260-y)/112,0];if(Math.abs(p[0])<=2&&Math.abs(p[1])<=2)onPoint(p);}} />;
}
