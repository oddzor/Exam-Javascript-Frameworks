import '@testing-library/jest-dom';
import * as jwt from 'jsonwebtoken';

describe("JWT Admin Role Test", () => {
  test("Decode JWT and check for role : admin", () => {
    const secret = "mysecretkey";
    const token = jwt.sign({ role: "admin" }, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret) as { role?: string };
    expect(decoded.role).toBe("admin");
  });
});