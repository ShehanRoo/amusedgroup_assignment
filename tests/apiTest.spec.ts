import { test, expect } from "@playwright/test";
import { validateSchema } from "../utils/schemaValidator";
import { ApiResponse } from "../types/apiResponse";
import newItemPayload from "../payloads/post_request_payload.json";
import updateItemPayload from "../payloads/put_request_payload.json";

let itemName: string;
let itemId: number;

test.beforeAll(async ({ request }) => {
  newItemPayload.name = `Productivity Machine ${new Date().toISOString()}`;
  itemName = newItemPayload.name;

  const response = await request.post("/objects", { data: newItemPayload });
  const payload: ApiResponse = await response.json();

  expect(response.status()).toBe(200);
  itemId = payload.id!;
});

test.describe("REST API Validation Tests", () => {
  test("Validate response for multiple objects GET request", async ({ request }) => {
    const response = await request.get("/objects");
    const payload: ApiResponse[] = await response.json();

    expect(response.status()).toBe(200);
    expect(validateSchema("allObjects", payload)).toBe(true);

    const specificItem = payload[2];
    expect(specificItem.id).toBe("3");
    expect(specificItem.name).toBe("Apple iPhone 12 Pro Max");
    expect(specificItem.data?.color).toBe("Cloudy White");
  });

  test("Validate response for POST request", async ({ request }) => {
    newItemPayload.name = "Surface New";

    const response = await request.post("/objects", { data: newItemPayload });
    const payload: ApiResponse = await response.json();

    expect(response.status()).toBe(200);
    expect(validateSchema("newItem", payload)).toBe(true);
    expect(payload.name).toBe("Surface New");
  });

  test("Validate response for single object GET request", async ({ request }) => {
    const response = await request.get(`/objects/${itemId}`);
    const payload: ApiResponse = await response.json();

    expect(response.status()).toBe(200);
    expect(validateSchema("singleObject", payload)).toBe(true);
    expect(payload.name).toBe(itemName);
    expect(payload.data?.price).toBe(1849.99);
  });

  test("Validate response for PUT request", async ({ request }) => {
    updateItemPayload.name = itemName;

    const response = await request.put(`/objects/${itemId}`, {
      data: updateItemPayload,
    });
    const payload: ApiResponse = await response.json();

    expect(response.status()).toBe(200);
    expect(validateSchema("updatedItem", payload)).toBe(true);
    expect(payload.name).toBe(itemName);
    expect(payload.data?.price).toBe(2589.99);
    expect(payload.data?.GPU).toBe("Nvidia");
  });

  test("Validate response for DELETE request", async ({ request }) => {
    const response = await request.delete(`/objects/${itemId}`);
    const payload: ApiResponse = await response.json();

    expect(response.status()).toBe(200);
    expect(validateSchema("deletedItem", payload)).toBe(true);
    expect(payload.message).toBe(
      `Object with id = ${itemId} has been deleted.`
    );
  });
});
