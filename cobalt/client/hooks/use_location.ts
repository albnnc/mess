import { useEffect, useState } from "../deps.ts";

export function useLocation() {
  const [locationCopy, setLocationCopy] = useState(location);
  useEffect(() => {
    const handleChange = () => setLocationCopy({ ...location });
    addEventListener("hashchange", handleChange);
    addEventListener("popstate", handleChange);
    addEventListener("pushstate", handleChange);
    addEventListener("replacestate", handleChange);
    return () => {
      removeEventListener("hashchange", handleChange);
      removeEventListener("popstate", handleChange);
      removeEventListener("pushstate", handleChange);
      removeEventListener("replacestate", handleChange);
    };
  }, []);
  return locationCopy;
}
