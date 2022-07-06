function generateKeys(length, indicator, multi = 10, negative = false) {
  const obj = {};

  for (let i = 0; i < length; i++) {
    obj[i * multi] = `${i * multi}${indicator}`;
    if (negative) obj[`-${i * multi}`] = `-${i * multi}${indicator}`;
  }

  return obj;
}

module.exports = {
  mode: "jit",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        ...generateKeys(50, "px", 50),
        unset: "unset",
        full: "100%",
      },
      zIndex: {
        ...generateKeys(11, "", 10, true),
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked", "disabled", "group-focus"],
      backgroundOpacity: ["group-focus"],
      borderWidth: ["group-focus"],
      opacity: ["group-focus"],
      borderColor: ["checked", "disabled"],
      boxShadow: ["active"],
      rotate: ["group-focus"],
      inset: ["hover", "focus", "group-focus"],
    },
  },
  plugins: [],
};
