const parseCommitBody = require("./parseCommitBody");

// Test the function with the provided test cases
const testCases = [
  { body: `lorem\ncloses issue-123`, commit: { short: "aaa" }, expected: ['ISSUE-123'] },
  { body: `lorem\nresolves issue-456`, commit: { short: "bbb" }, expected: ['ISSUE-456'] },
  { message: `fix: MVP-789 - add necessary fix`, commit: { short: "ccc" }, expected: ['MVP-789'] },
  { message: `fix: [MVP-789] - add necessary fix`, commit: { short: "ccc" }, expected: ['MVP-789'] },
  { message: `feat: MVP-403 File AI tagging integration (#185)
    * feat: MVP-403 Added AI tag mapping and event listener for new files
    * fix: MVP-403 Updated AI Client Tags, application properties and functional tests for sign up and login
    * fix: MVP-403 Updated ConditionalOnProperty prefixes in AI service classes
    ---------
    Co-authored-by: Colin Kater <Colin.Kater@ktr-solutions.com>`, commit: { short: "ccc" }, expected: ['MVP-403'] },
  { message: `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`, commit: { short: "ccc" }, expected: ['MVP-687'] },
  { message: `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`, commit: { short: "ccc" }, expected: ['MVP-687'] },
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

Co-authored-by: Colin Kater <katercolin@gmail.com>`, commit: { short: "ccc" }, expected: ['MVP-618'] },
  { message: `lorem\nfix: MVP-999 - add second necessary fix`, commit: { short: "ddd" }, expected: ['MVP-999'] },
  { message: `nothing in here`, commit: { short: "ddd22" }, expected: [] },
  { message: `feat: MVP-123 - new feature (#321)\ncloses MVP-456`, commit: { short: "eee" }, expected: ['MVP-123'] },
  { message: `feat: new feature without issue key\nanother line without issue key`, commit: { short: "fff" }, expected: [] }
];

testCases.forEach((testCase, index) => {
  const result = parseCommitBody(testCase);
  const expected = testCase.expected;
  const success = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`Test case ${index + 1}: ${success ? 'Passed' : 'Failed'}`);
  if (!success) {
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Got: ${JSON.stringify(result)}`);
  }
});
