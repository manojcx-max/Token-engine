/** @type {import('tailwindcss').Config} */
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "brand": {
          "500": "#d0d6e0",
          "600": "#e4f222"
        },
        "neutral": {
          "100": "#f7f8f8",
          "200": "#e6e6e6",
          "300": "#e2e4e6",
          "400": "#8a8f98",
          "500": "#62666d",
          "600": "#3e3e44",
          "700": "#3b3b3b",
          "800": "#383b3f"
        }
      },
      "fontFamily": {
        "sans": [
          "Inter Variable",
          "sans-serif"
        ],
        "heading": [
          "Inter Variable",
          "sans-serif"
        ]
      },
      "borderRadius": {
        "sm": "4px",
        "md": "8px",
        "lg": "16px"
      },
      "spacing": {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "24px",
        "5": "32px"
      },
      "boxShadow": {
        "subtle": "rgba(0, 0, 0, 0.03) 0px 1.2px 0px 0px",
        "medium": "rgba(0, 0, 0, 0.4) 0px 2px 4px 0px",
        "deep": "rgba(0, 0, 0, 0) 0px 8px 2px 0px, rgba(0, 0, 0, 0.01) 0px 5px 2px 0px, rgba(0, 0, 0, 0.04) 0px 3px 2px 0px, rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 1px 0px"
      },
      "zIndex": {
        "base": 1,
        "raised": 3,
        "dropdown": 50,
        "sticky": 100
      },
      "transitionDuration": {
        "fast": "100ms",
        "normal": "1200ms",
        "slow": "2800ms"
      },
      "transitionTimingFunction": {
        "standard": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "in": "ease-in",
        "out": "ease-out"
      },
      "backgroundImage": {
        "brand-gradient": "repeating-linear-gradient(to right, rgb(35, 37, 42) 0px, rgb(35, 37, 42) 3px, rgba(0, 0, 0, 0) 3px, rgba(0, 0, 0, 0) 7px)"
      }
    }
  }
};