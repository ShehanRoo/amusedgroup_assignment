import { getSchema } from "./ajvCompiler";

export const validateSchema = (schemaName: string, payload: unknown): boolean => {
  const validate = getSchema(schemaName);
  const isValid = validate(payload);

  if (!isValid) {
    console.error("Validation errors:", validate.errors);
  }

  return isValid;
};
