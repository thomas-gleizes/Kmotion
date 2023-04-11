/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        md: ["18px", "22px"]
      },
      spacing: {
        header: "50px",
        footer: "50px"
      }
    }
  },
  plugins: []
};
