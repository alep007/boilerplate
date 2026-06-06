import { resolveSchema } from "@repo/forms";
import type { Schema } from "@data-driven-forms/react-form-renderer";
import rawSchema from "./order-form-schema.mock.json";
import { ORDER_SCHEMA_OPTIONS } from "./schemaConfig";

/**
 * Builds the DDF schema for the order form.
 * rawSchema simulates an API response — swap the import for a fetch() call
 * to make this fully server-driven.
 */
export function buildOrderSchema(t: (key: string) => string): Schema {
  return resolveSchema(rawSchema, t, ORDER_SCHEMA_OPTIONS) as unknown as Schema;
}
