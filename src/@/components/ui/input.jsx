// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
"use client";;
import * as React from "react";
import { cn } from "../../lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

const Input = React.forwardRef(({ className, type, children, ...props }, ref) => {
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = React.useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    (<motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--blue-500),
        transparent 60%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="relative p-[2px] rounded-lg transition duration-300 group/input">
      <input
        type={type}
        className={cn(
          `flex h-[32px] min-w-[340px] w-full border-none bg-[#f4f4f5] dark:bg-zinc-800 text-black dark:text-white rounded-md py-1 pl-8 pr-3 text-xs  file:border-0 file:bg-transparent
        file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
        focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-[2px]  focus-visible:ring-[#e5e5e5]
         disabled:cursor-not-allowed disabled:opacity-50
         group-hover/input:shadow-none transition duration-400
         `,
          className
        )}
        ref={ref}
        {...props} />
		{children}
    </motion.div>)
  );
});
Input.displayName = "Input";

export { Input };