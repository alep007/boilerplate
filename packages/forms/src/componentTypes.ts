export const COMPONENT_TYPES = {
  FORM_SECTION: "form-section",
  SIDE_BY_SIDE: "side-by-side",
  FORM_API_CAPTURE: "__form_api_capture",
} as const;

export type ComponentTypeKey = keyof typeof COMPONENT_TYPES;
export type ComponentTypeValue = (typeof COMPONENT_TYPES)[ComponentTypeKey];
