/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            loginBypass(): Chainable<void>;
            seedAuthState(options?: SeedAuthStateOptions): Chainable<void>;
        }
    }
}

interface SeedAuthStateOptions {
    token?: string;
    user?: Record<string, unknown>;
    isAuthenticated?: boolean;
}

const createMockToken = () => {
    const encodeBase64Url = (value: Record<string, unknown>) => {
        return btoa(JSON.stringify(value))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");
    };

    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
        id: "user-123",
        email: "testuser@aiinterview.com",
        role: "candidate",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.signature`;
};

export const createMockAuthState = (options: SeedAuthStateOptions = {}) => {
    const token = options.token ?? createMockToken();

    return {
        state: {
            user: {
                id: "user-123",
                email: "testuser@aiinterview.com",
                fullName: "Test User",
                role: "candidate",
                createdAt: "2026-06-29T12:00:00.000Z",
                ...(options.user ?? {}),
            },
            token,
            isAuthenticated: options.isAuthenticated ?? true,
        },
        version: 0,
    };
};

export const seedAuthStorageToWindow = (win: Window, options: SeedAuthStateOptions = {}) => {
    const authState = createMockAuthState(options);
    win.localStorage.setItem("token", authState.state.token);
    win.localStorage.setItem("auth-storage", JSON.stringify(authState));
};

Cypress.Commands.add('seedAuthState', (options: SeedAuthStateOptions = {}) => {
    cy.window().then((win) => {
        seedAuthStorageToWindow(win, options);
    });
});

Cypress.Commands.add('loginBypass', () => {
    cy.visit("/", { failOnStatusCode: false });
    cy.clearLocalStorage();
    cy.seedAuthState();
});

export { }