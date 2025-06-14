import { useEffect } from "react";

const useClickOutside = (handler: (event: MouseEvent) => void) => {
  useEffect(() => {
    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [handler]);
};

export default useClickOutside;
