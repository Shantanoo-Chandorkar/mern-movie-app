/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonColor: "#FF6B6B",
        bgColor: "#151824",
        headerColor: "#FFFFFF",
        prdDetailsColor: "#17A2B8",
        hoverColor: "#33D9B2",
        paraColor: "#D1D9E6",
        subheaderColor: "#F39C12",
        secondaryColor: "#4CAF50",
        tertiaryColor: "#FFD700",
        neutralColor1: "#757575",
        neutralColor2: "#A0A0A0",
        alertColor: "#FF4081",
      },
    },
  },
  plugins: [],
};
