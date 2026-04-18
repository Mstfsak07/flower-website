import { visualExperienceConfigs } from "@/lib/data";

export function getVisualConfigValue(key: string, fallback = "") {
  return visualExperienceConfigs.find((item) => item.key === key)?.value ?? fallback;
}

export function isVisualConfigEnabled(key: string) {
  return getVisualConfigValue(key) === "true";
}

export function getMotionPreset() {
  const value = getVisualConfigValue("motionIntensity", "balanced");
  if (value === "calm") {
    return { duration: 0.42, y: 14 };
  }
  if (value === "expressive") {
    return { duration: 0.78, y: 30 };
  }
  return { duration: 0.6, y: 22 };
}
