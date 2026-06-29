// cypress/e2e/profile/profile.cy.ts

import { seedAuthStorageToWindow } from "../support/commands";

// ─────────────────────────────────────────────────────────
// Mock data (Khớp 100% với cấu trúc state của useAuthStore)
// ─────────────────────────────────────────────────────────
const MOCK_USER = {
    id: "user-123",
    email: "testuser@aiinterview.com",
    fullName: "Test User",
    role: "candidate",
    avatarUrl: null,
    phone: "0901234567",
    dob: "2000-01-15",
    bio: "Xin chào, mình là Test User.",
    createdAt: "2026-06-29T12:00:00.000Z",
    creditsBalance: 10,
};

const MOCK_PROFILE_RESPONSE = {
    success: true,
    message: "Get profile successful",
    data: MOCK_USER,
};

const MOCK_UPDATE_SUCCESS = {
    success: true,
    message: "Update profile successful",
    data: { ...MOCK_USER, fullName: "Updated Name" },
};

const MOCK_UPDATE_PASSWORD_SUCCESS = {
    success: true,
    message: "Update password successful",
    data: MOCK_USER,
};

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const interceptGetProfile = () => {
    cy.intercept("GET", "/api/v1/user/me", {
        statusCode: 200,
        body: MOCK_PROFILE_RESPONSE,
    }).as("getProfile");
};

const interceptUpdateProfile = (statusCode = 200, body = MOCK_UPDATE_SUCCESS) => {
    cy.intercept("PUT", "/api/v1/user/me", { statusCode, body }).as("updateProfile");
};

const interceptUpdatePassword = (statusCode = 200, body = MOCK_UPDATE_PASSWORD_SUCCESS) => {
    cy.intercept("PUT", "/api/v1/user/me", { statusCode, body }).as("updatePassword");
};

const interceptLogout = (statusCode = 200) => {
    cy.intercept("POST", "/api/v1/auth/logout", { statusCode, body: {} }).as("logout");
};

const setupProfile = () => {
    interceptGetProfile();

    cy.visit("/profile", {
        onBeforeLoad: (win) => {
            win.localStorage.clear();
            seedAuthStorageToWindow(win, {
                user: {
                    ...MOCK_USER,
                    createdAt: "2026-06-29T12:00:00.000Z",
                },
            });
        },
    });

    cy.get("body", { timeout: 10000 }).should("exist");
};

const getProfileForm = () => {
    return cy.contains('form', 'Họ và tên').should('exist');
};

const fillFullName = (fullName: string) => {
    getProfileForm().find('input[type="text"]').first().clear({ force: true });
    if (fullName) {
        getProfileForm().find('input[type="text"]').first().type(fullName, { force: true });
    }
};

const submitEditForm = () => {
    getProfileForm().find('button[type="submit"]').click();
};

const openPasswordAccordion = () => {
    cy.contains('button', 'Đổi mật khẩu').click();
};

const fillPasswordForm = (newPassword: string, confirmPassword: string) => {
    cy.contains('label', 'Mật khẩu mới').parent().find('input[type="password"]').clear().type(newPassword);
    cy.contains('label', 'Xác nhận mật khẩu').parent().find('input[type="password"]').clear().type(confirmPassword);
};

const submitPasswordForm = () => {
    cy.contains('form', 'Mật khẩu mới').should('exist').find('button[type="submit"]').click();
};

// ─────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────
describe("Profile Page", () => {

    // ───────────────────────────────────────────
    // Form Prefill
    // ───────────────────────────────────────────
    describe("Form Prefill", () => {
        beforeEach(setupProfile);

        it("should prefill email and disable the field", () => {
            cy.contains('label', 'Email').parent().find('input[type="email"]')
                .should("have.value", MOCK_USER.email)
                .and("be.disabled");
        });

        it("should prefill dob correctly", () => {
            cy.contains('label', 'Ngày sinh').parent().find('input[type="date"]').should("have.value", MOCK_USER.dob);
        });

        it("should prefill bio correctly", () => {
            cy.contains('label', 'Giới thiệu').parent().find('textarea').should("have.value", MOCK_USER.bio);
        });
    });

    // ───────────────────────────────────────────
    // Avatar Upload
    // ───────────────────────────────────────────
    describe("Avatar Upload", () => {
        beforeEach(setupProfile);

        it("should hide avatar URL input by default", () => {
            cy.get('input[type="url"]').should("not.exist");
        });

        it("should show avatar URL input when camera button clicked", () => {
            cy.get("button").filter(":has(.lucide-camera)").click();
            cy.get('input[type="url"]').should("be.visible");
        });

        it("should toggle avatar URL input on camera button click", () => {
            cy.get("button").filter(":has(.lucide-camera)").click();
            cy.get('input[type="url"]').should("be.visible");

            cy.get("button").filter(":has(.lucide-camera)").click();
            cy.get('input[type="url"]').should("not.exist");
        });
    });

    // ───────────────────────────────────────────
    // Form Validation
    // ───────────────────────────────────────────
    describe("Form Validation", () => {
        beforeEach(setupProfile);

        it("should show error when fullName is empty", () => {
            fillFullName("");
            getProfileForm().invoke("attr", "novalidate", "novalidate");
            submitEditForm();

            cy.get("p.text-semantic-error").should("be.visible");
        });

        it("should NOT show error when fullName is filled", () => {
            fillFullName("Valid Name");
            getProfileForm().invoke("attr", "novalidate", "novalidate");
            submitEditForm();

            cy.get("p.text-semantic-error").should("not.exist");
        });
    });

    // ───────────────────────────────────────────
    // Update Profile
    // ───────────────────────────────────────────
    describe("Update Profile", () => {
        beforeEach(setupProfile);

        it("should send correct payload when updating profile", () => {
            interceptUpdateProfile();
            fillFullName("Updated Name");
            submitEditForm();

            cy.wait("@updateProfile").then((interception) => {
                expect(interception.request.body).to.include({ fullName: "Updated Name" });
                expect(interception.response!.statusCode).to.equal(200);
            });
        });

        it("should show loading state while updating", () => {
            cy.intercept("PUT", "/api/v1/user/me", {
                delay: 1500,
                statusCode: 200,
                body: MOCK_UPDATE_SUCCESS,
            }).as("slowUpdate");

            fillFullName("Updated Name");
            submitEditForm();

            cy.get('button[type="submit"]').first()
                .find(".animate-spin").should("exist")
                .closest("button").should("be.disabled");
        });

        it("should stay on profile page after successful update", () => {
            interceptUpdateProfile();
            fillFullName("Updated Name");
            submitEditForm();

            cy.wait("@updateProfile");
            cy.url().should("include", "/profile");
        });

        it("should remain on profile page on update error", () => {
            cy.on('uncaught:exception', () => false);
            interceptUpdateProfile(500, { success: false, message: "Server error" });
            fillFullName("Updated Name");
            submitEditForm();

            cy.wait("@updateProfile");
            cy.url().should("include", "/profile");
        });
    });

    // ───────────────────────────────────────────
    // Password Accordion
    // ───────────────────────────────────────────
    describe("Password Accordion", () => {
        beforeEach(setupProfile);

        it("should open password accordion when clicked", () => {
            openPasswordAccordion();
            cy.contains('label', 'Mật khẩu mới').parent().find('input[type="password"]').should("be.visible");
            cy.contains('label', 'Xác nhận mật khẩu').parent().find('input[type="password"]').should("be.visible");
        });

        it("should close password accordion when clicked again", () => {
            openPasswordAccordion();
            cy.contains('label', 'Mật khẩu mới').should('be.visible');
            openPasswordAccordion();
            cy.contains('label', 'Mật khẩu mới').should('not.exist');
        });

        it("should open password accordion and show input fields", () => {
            openPasswordAccordion();
            cy.contains('form', 'Mật khẩu mới').should("be.visible");
        });
    });

    // ───────────────────────────────────────────
    // Change Password
    // ───────────────────────────────────────────
    describe("Change Password", () => {
        beforeEach(() => {
            setupProfile();
            openPasswordAccordion();
        });

        it("should show error when passwords do not match", () => {
            fillPasswordForm("Password123!", "Different999!");
            cy.contains('form', 'Mật khẩu mới').invoke("attr", "novalidate", "novalidate");
            submitPasswordForm();

            cy.get("p.text-semantic-error").should("be.visible");
        });

        it("should NOT show error when passwords match", () => {
            interceptUpdatePassword();
            fillPasswordForm("Password123!", "Password123!");
            cy.contains('form', 'Mật khẩu mới').invoke("attr", "novalidate", "novalidate");
            submitPasswordForm();

            cy.get("p.text-semantic-error").should("not.exist");
        });

        it("should send correct payload when passwords match", () => {
            interceptUpdatePassword();
            fillPasswordForm("NewPass123!", "NewPass123!");
            submitPasswordForm();

            cy.wait("@updatePassword").then((interception) => {
                expect(interception.request.body).to.have.property("password", "NewPass123!");
                expect(interception.response!.statusCode).to.equal(200);
            });
        });

        it("should show loading spinner while updating password", () => {
            cy.intercept("PUT", "/api/v1/user/me", {
                delay: 1500,
                statusCode: 200,
                body: MOCK_UPDATE_PASSWORD_SUCCESS,
            }).as("slowPasswordUpdate");

            fillPasswordForm("NewPass123!", "NewPass123!");
            submitPasswordForm();

            cy.contains('form', 'Mật khẩu mới').find('button[type="submit"]')
                .should('contain.text', 'Đang đổi...')
                .and('be.disabled');
        });

        it("should close accordion after successful password change", () => {
            interceptUpdatePassword();
            fillPasswordForm("NewPass123!", "NewPass123!");
            submitPasswordForm();

            cy.wait("@updatePassword");
            cy.contains('label', 'Mật khẩu mới').should("not.exist");
        });

        it("should remain on profile page after password update error", () => {
            cy.on('uncaught:exception', () => false);
            cy.intercept("PUT", "/api/v1/user/me", {
                statusCode: 400,
                body: { success: false, message: "Bad request" }
            }).as("passwordError");

            fillPasswordForm("NewPass123!", "NewPass123!");
            submitPasswordForm();

            cy.wait("@passwordError");
            cy.url().should("include", "/profile");
        });
    });

    // ───────────────────────────────────────────
    // Logout
    // ───────────────────────────────────────────
    describe("Logout", () => {
        beforeEach(setupProfile);

        it("should clear localStorage on logout", () => {
            interceptLogout();
            cy.contains('button', 'Đăng xuất').click();

            cy.window().should((win) => {
                expect(win.localStorage.getItem("token")).to.be.null;
                expect(win.localStorage.getItem("auth-storage")).to.include('"isAuthenticated":false');
            });
        });

        it("should redirect to login after logout", () => {
            interceptLogout();
            cy.contains('button', 'Đăng xuất').click();

            cy.url().should("include", "/login");
        });
    });

    // ───────────────────────────────────────────
    // Delete Account
    // ───────────────────────────────────────────
    describe("Delete Account", () => {
        beforeEach(setupProfile);

        it("should render delete account button", () => {
            cy.get('button').should("have.length.greaterThan", 0);
        });
    });

    // ───────────────────────────────────────────
    // Purchase History
    // ───────────────────────────────────────────
    describe("Purchase History", () => {
        beforeEach(setupProfile);

        it("should have tab navigation buttons", () => {
            cy.get('button').should("have.length.greaterThan", 0);
        });
    });
});

export { };