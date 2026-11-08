type FontClass = {
  className: string;
};

// Font files are bundled locally through @fontsource-variable imports in the
// root layout. Keeping these class names in one module avoids repeated
// next/font transformations during production builds.
export const notoSerif: FontClass = { className: "font-noto-serif" };
export const manrope: FontClass = { className: "font-manrope" };
export const plusJakartaSans: FontClass = { className: "font-plus-jakarta" };
