export const manifest = {
  screens: {
    scr_4b5d34: { name: "Landing", route: "/", state: { "isAuthenticated": false, "currentView": "landing" } },
    scr_dtnx25: { name: "Login", route: "/", state: { "isAuthenticated": false, "currentView": "login" } },
    scr_30empu: { name: "Dashboard", route: "/", state: { "isAuthenticated": true, "currentView": "dashboard" } },
    scr_ytl4uc: { name: "POS", route: "/", state: { "isAuthenticated": true, "currentView": "pos" } },
    scr_lqtrfn: { name: "Inventory", route: "/", state: { "isAuthenticated": true, "currentView": "inventory" } },
    scr_cklwcw: { name: "Reports", route: "/", state: { "isAuthenticated": true, "currentView": "reports" } },
    scr_kvqnd5: { name: "Billing", route: "/", state: { "isAuthenticated": true, "currentView": "billing" } }
  },
  sections: {
    sec_jpl36p: { name: "Authentication Flow", x: 0, y: 0, width: 2920, height: 1180 },
    sec_7lrerh: { name: "Main Modules", x: 0, y: 1980, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_jpl36p", children: [
    { kind: "screen", id: "scr_y9zgir" },
    { kind: "screen", id: "scr_fg8hen" }]
  },
  { kind: "section", id: "sec_7lrerh", children: [
    { kind: "screen", id: "scr_zjw8x7" },
    { kind: "screen", id: "scr_eda4h5" },
    { kind: "screen", id: "scr_gafkpl" }]
  }]

};