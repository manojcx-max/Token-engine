# Token Generation Specification

## Output Format

Return structured object:

{
  colors: {
    primary: "",
    secondary: "",
    neutrals: []
  },
  fonts: {
    heading: "",
    body: ""
  },
  radius: {
    sm: "",
    md: "",
    lg: ""
  }
}

## Naming Logic

Primary:
- Most frequent non-neutral color

Secondary:
- Second most frequent accent

Neutrals:
- Greys / blacks / whites
- Detect low saturation colors

Radius Mapping:
- Smallest → sm
- Middle → md
- Largest → lg

## Final CSS Output

Generate:

:root {
  --color-primary: #XXXXXX;
  --color-secondary: #XXXXXX;

  --font-heading: "FontName", sans-serif;
  --font-body: "FontName", sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
