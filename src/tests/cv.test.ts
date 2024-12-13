import '@testing-library/jest-dom';

test("Mock POST and GET for CVs", async () => {
  const mockCV = { personalInfo: { name: "Test", email: "t@test.com", phone: "1234", aboutMe: "Hello" }, skills: [], education: [], experience: [], references: [] };
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockCV, _id: "123" }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ ...mockCV, _id: "123" }]),
    }) as jest.Mock;
  const createdRes = await fetch("http://localhost:5000/api/cvs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(mockCV),
  });
  const created = await createdRes.json();
  expect(created._id).toBe("123");
  const fetchRes = await fetch("http://localhost:5000/api/cvs", { credentials: "include" });
  const cvs = await fetchRes.json();
  expect(cvs.length).toBe(1);
  expect(cvs[0]._id).toBe("123");
});