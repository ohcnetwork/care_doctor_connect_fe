# CARE Doctor Connect

A federated micro-frontend plugin for [CARE](https://github.com/ohcnetwork/care_fe) that adds a **Doctor Connect** sheet to the patient encounter view, letting clinical staff quickly browse a facility's organization tree and reach the right doctor (or any other role) on call.

## Features

- Adds a `Doctor Connect` quick action to the Patient Info Card on the encounter page.
- Renders the facility's organization tree as collapsible sections.
- Shows users assigned to each organization with their role and contact details.
- Filters users by role via an autocomplete (defaults to `Doctor` when available).
- Plugin-config driven filtering of which organizations and which roles appear (set per deployment from CARE's admin panel).

## Configuration

The plugin reads runtime configuration from the `meta` object of its `PlugConfig` in CARE core (managed under **Admin → Apps** in the CARE admin panel). Configuration is delivered to the plugin via the `__meta` prop injected by CARE's `PLUGIN_Component`.

### Supported keys

| Key                              | Type       | Description                                                                                                                             |
| -------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_facility_organizations` | `string[]` | Names of top-level facility organizations to show in the sheet. Matched case-insensitively against `organization.name`. Omit/empty = show all. |
| `allowed_filter_roles`           | `string[]` | Names of roles to expose in the role-filter autocomplete. Matched case-insensitively against `role.name`. Omit/empty = show all roles.  |

### Example

In CARE admin, set the plugin's `meta` JSON to:

```json
{
  "url": "https://doctor-connect.example.org/assets/manifest.js",
  "name": "care_doctor_connect_fe",
  "allowed_facility_organizations": ["Health Department"],
  "allowed_filter_roles": ["Doctor", "Nurse"]
}
```

With this config:

- Only the top-level facility organization named `Health Department` (case-insensitive) appears in the sheet. Others (e.g. `Administration`) are filtered out.
- The role filter autocomplete only offers `Doctor` and `Nurse`.

If a key is missing or its array is empty, no filtering is applied for that dimension (full backwards-compatible behavior).

> Note: `allowed_facility_organizations` filters **facility organizations** (the org tree shown inside the sheet) by name. `allowed_filter_roles` filters the **Role** catalog used by the autocomplete. These are independent — you can set either, both, or neither.

## Development

### Prerequisites

- Node.js 22+
- A running CARE backend and CARE frontend (see [care_fe](https://github.com/ohcnetwork/care_fe))

### Setup

```bash
npm install
npm run start    # builds in watch mode and serves on http://localhost:6173
```

Then in your local CARE frontend `.env`, register this plugin's manifest URL via `REACT_ENABLED_APPS` (or via the admin Apps page) pointing to `http://localhost:6173/assets/manifest.js`.

### Build

```bash
npm run build
```

The federated build is emitted to `dist/`.