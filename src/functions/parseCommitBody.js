/**
 * Parses commit body or message and searches for distinct issue numbers
 *
 * @param {Object} input object containing body or message to parse
 * @returns {string[]} array containing distinct issue numbers
 */
const parseCommitBody = function (input) {
  const body = input || "";
  
  if (!body) {
    return [];
  }

  const regEx = /([A-Z][A-Z0-9_]+\-[0-9]+)/gi;
  const prRegEx = /\(#\d+\)/;

  const bodyLines = body.trim().split("\n");

  // Check for GitHub PR lines
  const prLines = bodyLines.filter(line => prRegEx.test(line));

  if (prLines.length > 0) {
    // If PR lines are found, extract issue keys only from those lines
    const prMatches = prLines.join("\n").match(regEx);
    const prIssues = prMatches !== null ? Array.from(new Set(prMatches.map((match) => match.trim()))) : [];
    return prIssues;
  }

  // If no PR lines, extract issue keys from all lines
  const matches = bodyLines.join("\n").match(regEx);
  const issues = matches !== null ? Array.from(new Set(matches.map((match) => match.trim()))) : [];

  return issues.map(issue => issue.toUpperCase());
};

module.exports = parseCommitBody;
