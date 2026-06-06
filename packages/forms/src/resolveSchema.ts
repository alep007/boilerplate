import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import type { Schema } from "@data-driven-forms/react-form-renderer";
import type React from "react";

// ── Raw JSON types (what arrives from the API) ────────────────────────────────

export interface RawValidator {
  type: string;
  message?: string;
  threshold?: number;
  pattern?: string;
  [key: string]: unknown;
}

export interface RawField {
  component: string;
  name: string;
  label?: string;
  title?: string;
  icon?: string;
  span?: number;
  type?: string;
  rows?: number;
  number?: number;
  minDate?: string;
  startEnhancer?: string;
  condition?: { when: string; is: string };
  clearedValue?: unknown;
  options?: Array<{ id: string; label: string }>;
  validate?: RawValidator[];
  fields?: RawField[];
  [key: string]: unknown;
}

export interface RawSchema {
  fields: RawField[];
}

// ── Resolver options (domain-specific config injected by the caller) ──────────

export type CustomValidatorFn = (value: unknown, allValues: unknown) => string | undefined;
export type CustomValidatorFactory = (message: string) => CustomValidatorFn;

export interface ResolveSchemaOptions {
  iconMap?: Record<string, React.ElementType>;
  dateRefs?: Record<string, () => Date>;
  customValidators?: Record<string, CustomValidatorFactory>;
}

// ── Built-in DDF validator type mapping ───────────────────────────────────────

const BUILT_IN: Record<string, string> = {
  required:           validatorTypes.REQUIRED,
  "min-length":       validatorTypes.MIN_LENGTH,
  "max-length":       validatorTypes.MAX_LENGTH,
  pattern:            validatorTypes.PATTERN,
  "min-number-value": validatorTypes.MIN_NUMBER_VALUE,
  "max-number-value": validatorTypes.MAX_NUMBER_VALUE,
};

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveSchema(
  rawSchema: RawSchema,
  t: (key: string) => string,
  options?: ResolveSchemaOptions
): Schema {
  return {
    fields: rawSchema.fields.map((f) => resolveField(f, t, options)),
  } as unknown as Schema;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function resolveField(
  field: RawField,
  t: (key: string) => string,
  options?: ResolveSchemaOptions
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(field)) {
    switch (key) {
      case "label":
      case "title":
        out[key] = value != null ? t(value as string) : value;
        break;

      case "icon":
        out[key] = value != null ? (options?.iconMap?.[value as string] ?? undefined) : undefined;
        break;

      case "minDate":
        out[key] = value != null ? (options?.dateRefs?.[value as string]?.() ?? undefined) : undefined;
        break;

      case "validate":
        out[key] = resolveValidators(value as RawValidator[], t, options?.customValidators);
        break;

      case "fields":
        out[key] = (value as RawField[]).map((f) => resolveField(f, t, options));
        break;

      default:
        // Pass clearedValue through even when null/undefined
        if (value !== undefined || key === "clearedValue") {
          out[key] = value;
        }
    }
  }

  return out;
}

function resolveValidators(
  validators: RawValidator[],
  t: (key: string) => string,
  customValidators?: ResolveSchemaOptions["customValidators"]
): unknown[] {
  return validators
    .map((v) => {
      const message = v.message ? t(v.message) : "";

      const builtInType = BUILT_IN[v.type];
      if (builtInType) {
        return {
          type: builtInType,
          message,
          ...(v.threshold != null && { threshold: v.threshold }),
          ...(v.pattern != null && { pattern: v.pattern }),
        };
      }

      const factory = customValidators?.[v.type];
      if (factory) return factory(message);

      return null;
    })
    .filter(Boolean);
}
