module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Or wherever your components are located
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'custom-lg': '24px', // Custom size
      },
      lineHeight: {
        'custom-lg': '36px', // Custom line height
      },
      fontWeight: {
        'medium': 500, // Custom weight
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Ensure Poppins is defined
      },
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" },
        vaxBlue: "#3485FF"
      }
    },
    fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'poppins': ['Poppins', 'sans-serif'],
    }
  }
}
