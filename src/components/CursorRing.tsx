import { useEffect, useRef } from "react";

export default function CursorRing({ target = "button" }) {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current!;

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    document.addEventListener("mousemove", move);

    const elements = document.querySelectorAll(target);
    const handlePointerEnter = () => el.classList.add("active");
    const handlePointerLeave = () => el.classList.remove("active");

    elements.forEach((elTarget) => {
      elTarget.addEventListener("pointerenter", handlePointerEnter);
      elTarget.addEventListener("pointerleave", handlePointerLeave);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      elements.forEach((elTarget) => {
        elTarget.removeEventListener("pointerenter", handlePointerEnter);
        elTarget.removeEventListener("pointerleave", handlePointerLeave);
      });
    };
  }, [target]);

  return (
    <>
      <style>{`
        .cursor-ring {
          position: fixed;
          width: 50px;
          height: 50px;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.2s ease, background 0.3s ease;
          z-index: 9999;            
        }

        .cursor-ring.active {
          background: rgba(237, 158, 230, 0.06);;
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>

      <div className="cursor-ring" ref={ring}></div>
    </>
  );
}
