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
    { message: `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`, commit: { short: "ccc" } },
    { message: `feat: MVP-572 Upload all mastered files of an album (#327)`, body: `
    * Upload all mastered files of an album - Frontend
    
    * fix: error message
    
    * fix: uploading files
    
    * fix: error message`, commit: { short: "ccc" } },
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
    expect(await r).toEqual([{ json: true }, { json: true }, { json: true }, { json: true }, { json: true }, {json: true}]);
  });
});
