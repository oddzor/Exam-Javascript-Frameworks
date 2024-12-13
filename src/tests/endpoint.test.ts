import '@testing-library/jest-dom';

describe("Ensure API and routing works as intended", () => {
    test("GET request returns a list, PUT updates an item", async () => {
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ _id: "abc", name: "John" }],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ _id: "abc", name: "John Updated" }),
        }) as jest.Mock;
  
      const resGet = await fetch("http://localhost:5000/api/simple");
      const dataGet = await resGet.json();
      expect(dataGet[0].name).toBe("John");
  
      const resPut = await fetch("http://localhost:5000/api/simple/abc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "John Updated" }),
      });
      const dataPut = await resPut.json();
      expect(dataPut.name).toBe("John Updated");
    });
  });