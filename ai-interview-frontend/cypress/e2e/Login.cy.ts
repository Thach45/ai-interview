// cypress/e2e/auth/login.cy.ts

// ─────────────────────────────────────────────────────────
// Mock data (Khớp 100% với cấu trúc JSON thực tế của bạn)
// ─────────────────────────────────────────────────────────
const USER = {
  email: "testuser@aiinterview.com",
  password: "Password123!",
};

const MOCK_RESPONSE = {
  success: true,
  message: "Login successful",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token",
    refreshToken: "mock-refresh-token-xyz",
    user: {
      id: "user-123",
      email: "testuser@aiinterview.com",
      fullName: "Test User",
      role: "candidate",
      avatarUrl: null,
      createdAt: "2026-06-29T12:00:00.000Z",
      creditsBalance: 10,
    },
  },
};

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const fillAndSubmit = (email = USER.email, password = USER.password) => {
  if (email) cy.get('input[type="email"]').type(email);
  if (password) cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
};

const interceptLogin = (statusCode: number, body: object) => {
  cy.intercept(
    { method: "POST", url: "/api/v1/auth/login" },
    { statusCode, body },
  ).as("loginRequest");
};

// ─────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────
describe("Login Page", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  // ───────────────────────────────────────────
  // UI Rendering
  // ───────────────────────────────────────────
  describe("UI Rendering", () => {
    it("should render all login form elements correctly", () => {
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]')
        .should("be.visible")
        .and("not.be.disabled");
      cy.get('a[href="/forgot-password"]').should("be.visible");
      cy.get('a[href="/register"]').should("be.visible");
      // cy.get('img[alt="Google"]').closest("button").should("be.visible");
    });
  });

  // ───────────────────────────────────────────
  // Form Validation
  // ───────────────────────────────────────────
  describe("Form Validation", () => {
    it("should show error validation styles and messages when fields are empty", () => {
      cy.get('button[type="submit"]').click();

      cy.get('input[type="email"]')
        .should("have.class", "border-red-500")
        .siblings("p.text-red-500")
        .should("be.visible");

      cy.get('input[type="password"]')
        .should("have.class", "border-red-500")
        .siblings("p.text-red-500")
        .should("be.visible");
    });

    it("should show email error for invalid email format", () => {
      cy.get('input[type="email"]').type("not-an-email");
      cy.get("form").invoke("attr", "novalidate", "novalidate");
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]')
        .siblings("p.text-red-500")
        .should("be.visible");
    });

    it("should NOT show email error for valid email format", () => {
      cy.get('input[type="email"]').type(USER.email);
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]')
        .siblings("p.text-red-500")
        .should("not.exist");
    });
  });

  // ───────────────────────────────────────────
  // Successful Login
  // ───────────────────────────────────────────
  describe("Successful Login", () => {
    it("should send correct credentials and save token correctly", () => {
      interceptLogin(200, MOCK_RESPONSE);
      fillAndSubmit();

      // 1. Kiểm tra API payload nhận đúng dữ liệu gửi lên
      cy.wait("@loginRequest").then((interception) => {
        expect(interception.request.body).to.deep.equal({
          email: USER.email,
          password: USER.password,
        });
        expect(interception.response!.statusCode).to.equal(200);
      });

      // 2. Kiểm tra việc lưu trữ Token dựa trên cơ chế đồng bộ của Zustand Store
      cy.window().should((win) => {
        const expectedToken = MOCK_RESPONSE.data.accessToken;

        // Kiểm tra key 'token' lưu thủ công trong setAuth (localStorage.setItem('token', token))
        expect(win.localStorage.getItem("token")).to.equal(expectedToken);

        // Kiểm tra object 'auth-storage' tự động sinh bởi Zustand Persist Middleware
        const authStorage = JSON.parse(
          win.localStorage.getItem("auth-storage") || "{}",
        );
        expect(authStorage.state.token).to.equal(expectedToken);
        expect(authStorage.state.isAuthenticated).to.be.true;
        expect(authStorage.state.user.fullName).to.equal(
          MOCK_RESPONSE.data.user.fullName,
        );
      });
    });

    it("should show loading spinner while awaiting response", () => {
      cy.intercept("POST", "/api/v1/auth/login", {
        delay: 2000,
        statusCode: 200,
        body: MOCK_RESPONSE,
      }).as("slowLogin");

      fillAndSubmit();

      cy.get('button[type="submit"]').find(".animate-spin").should("exist");
      cy.get('button[type="submit"]')
        .should("be.disabled")
        .and("contain", "Đang đăng nhập...");

      cy.wait("@slowLogin");
    });
  });

  // ───────────────────────────────────────────
  // Failed Login
  // ───────────────────────────────────────────
  describe("Failed Login", () => {
    it("should handle 401 Unauthorized error correctly", () => {
      interceptLogin(401, { success: false, message: "Invalid credentials" });
      fillAndSubmit();
      cy.wait("@loginRequest");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
      });

      cy.get('button[type="submit"]').should("not.be.disabled");
      cy.url().should("include", "/login");
    });

    it("should stay on /login on server error (500)", () => {
      interceptLogin(500, { success: false, message: "Internal server error" });
      fillAndSubmit();
      cy.wait("@loginRequest");
      cy.url().should("include", "/login");
    });
  });

  // ───────────────────────────────────────────
  // Navigation
  // ───────────────────────────────────────────
  describe("Navigation", () => {
    it("should navigate to /forgot-password", () => {
      cy.get('a[href="/forgot-password"]').click();
      cy.url().should("include", "/forgot-password");
    });

    it("should navigate to /register", () => {
      cy.get('a[href="/register"]').click();
      cy.url().should("include", "/register");
    });
  });
});
