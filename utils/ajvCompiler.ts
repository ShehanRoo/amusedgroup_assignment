import Ajv, { ValidateFunction } from "ajv";
import schema_single_get from '../schemas/schema_single_object.json';
import schema_multiple_get from '../schemas/schema_all_objects.json';
import schema_post from '../schemas/schema_post.json';
import schema_put from '../schemas/schema_put.json';
import schema_delete from '../schemas/schema_delete.json'

const ajv = new Ajv();
ajv.addSchema(schema_single_get, "singleObject");
ajv.addSchema(schema_multiple_get, "allObjects");
ajv.addSchema(schema_post, "newItem");
ajv.addSchema(schema_put, "updatedItem");
ajv.addSchema(schema_delete, "deletedItem")

export function getSchema(schemaKey: string): ValidateFunction {
    const validate = ajv.getSchema(schemaKey);
    if (!validate) {
      throw new Error(`Schema '${schemaKey}' is not found in Ajv instance.`);
    }
    return validate;
  }
  
  export default ajv;
