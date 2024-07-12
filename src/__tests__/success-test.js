const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const success = require("../success.js");

const testVersion = "1.0.0";
const validConfig = {
  auth: {
    type: "Basic",
    userEnvVar: "JIRA_USER",
    passEnvVar: "JIRA_PASS",
    tokenEnvVar: undefined,
  },
  actions: [
    {
      method: "POST",
      url: "https://jira.example.com/rest/api/2/versions",
      body:
        '{ "name": "${version}", "archived": false, "released": true, "project": "${project}"}',
      ignoreErrors: [
        "A version with this name already exists in this project.",
      ],
    },
    {
      method: "PUT",
      url: "https://jira.example.com/rest/api/2/issues/${issueKey}",
      body: '{"update":{"labels":[{"add":"some-component:${version}"}]}}',
    },
    {
      method: "PUT",
      url: "https://jira.example.com/rest/api/2/issues/${issueKey}",
      body:
        '{"update":{"fixVersions":[{"add":{"name":"Some Component ${version}"}}]}}',
    },
    {
      method: "POST",
      url: "https://jira.example.com/rest/api/2/issue/${issueKey}/transitions",
      body: '{"transition":{"id":151}}',
    },
  ],
};
const validContext = {
  nextRelease: { version: testVersion },
  commits: [
    { body: `lorem\ncloses issue-123`, commit: { short: "aaa" } },
    { body: `lorem\nresolves issue-456`, commit: { short: "bbb" } },
    { message: `fix: MVP-789 - add necessary fix`, commit: { short: "ccc" } },
    { message: `fix: [MVP-789] - add necessary fix`, commit: { short: "ccc" } },
    { message: `feat: MVP-403 File AI tagging integration (#185)
    * feat: MVP-403 Added AI tag mapping and event listener for new files
    * fix: MVP-403 Updated AI Client Tags, application properties and functional tests for sign up and login
    * fix: MVP-403 Updated ConditionalOnProperty prefixes in AI service classes
    ---------
    Co-authored-by: Colin Kater <Colin.Kater@ktr-solutions.com>`, commit: { short: "ccc" } },
    { message: `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`, commit: { short: "ccc" } },
    { message: `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`, commit: { short: "ccc" } },
    { message: `feat: MVP-618 label and artist dashboards (#370)

* feat: MVP-618 added new label dashboard

* feat: MVP-618 Added landingImageFileId property and updated dashboard components, introduced ProjectCard component

* ci: MVP-618 Added SOLUTION env variable and updated URLs in GitHub workflow

* fix: MVP-618 Moved ktr.png and ktr.svg to assets folder and deleted logo192.png and logo512.png

* refactor: MVP-618 Refactor various imports in different files to use new config directory

* fix: MVP-618 Refactor ActivitySection Component and update event visuals

* fix: MVP-618 Updated formatting & added null check in Stat.tsx

* fix: MVP-618 Replaced npm install and build with bun and checked user object availability

* fix: MVP-618 Add condition to handle missing targetUser in ActivitySection

---------

Co-authored-by: Colin Kater <katercolin@gmail.com>`, body: `
    * feat: MVP-618 added new label dashboard

* feat: MVP-618 Added landingImageFileId property and updated dashboard components, introduced ProjectCard component

* ci: MVP-618 Added SOLUTION env variable and updated URLs in GitHub workflow

* fix: MVP-618 Moved ktr.png and ktr.svg to assets folder and deleted logo192.png and logo512.png

* refactor: MVP-618 Refactor various imports in different files to use new config directory

* fix: MVP-618 Refactor ActivitySection Component and update event visuals

* fix: MVP-618 Updated formatting & added null check in Stat.tsx

* fix: MVP-618 Replaced npm install and build with bun and checked user object availability

* fix: MVP-618 Add condition to handle missing targetUser in ActivitySection

---------

Co-authored-by: Colin Kater <katercolin@gmail.com>`, commit: { short: "ccc" } },
    { message: `lorem\nfix: MVP-999 - add second necessary fix`, commit: { short: "ddd" } },
    { message: `nothing in here`, commit: { short: "ddd22" } },
  ],
  logger: {
    success: console.log,
    error: console.error,
    debug: () => {},
    info: console.info,
  },
  env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" },
};

describe("success", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("successfully updates issue with correct data", async () => {
    expect.assertions(1);

    fetch.mockResponse(JSON.stringify({ json: true }));
    const r = success(
      { ...validConfig },
      {
        ...validContext,
        logger: {
          ...validContext.logger,
        },
      }
    );
    expect(await r).toEqual([{ json: true }, { json: true }, { json: true }, { json: true }, { json: true }, {json: true}, {json: true}]);
  });
});
