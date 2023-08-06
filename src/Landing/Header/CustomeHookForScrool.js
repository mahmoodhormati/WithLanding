import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);
  const{pageYOffset, scrollY}= window;
  useEffect(() => {
    const options = { passive: true };
    const updateScrollDirection = () => {
        
        
    let lastScrollY=pageYOffset
 console.log(lastScrollY);
    
      const scrollY = pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection,options); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection,options); // clean up
    }
  }, [pageYOffset]);

  return scrollDirection;
};