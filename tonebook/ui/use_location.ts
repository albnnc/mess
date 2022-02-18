import { useEffect, useState } from "../../rembrandt/mod.ts";

export function useLocation() {
  const [locationCopy, setLocationCopy] = useState(location);
  useEffect(() => {
    const handleChange = () => setLocationCopy({ ...location });
    addEventListener("hashchange", handleChange);
    addEventListener("popstate", handleChange);
    return () => {
      removeEventListener("hashchange", handleChange);
      removeEventListener("popstate", handleChange);
    };
  }, []);
  return locationCopy;
}
