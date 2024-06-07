/**
 * Parses commit body and searches for issue numbers
 *
 * @param {string} body message to parse
 * @returns {string[]} array containing issue numbers
 */
const parseCommitBody = function (body) {
  if (!body) {
    return [];
  }

  const regEx = /([A-Z][A-Z0-9_]+\-[0-9]+)/gi;
  const bodyLines = body.trim().split("\n");
  const lastEmptyLine = bodyLines.lastIndexOf("");

  const matches = bodyLines.slice(lastEmptyLine + 1).join("\n").match(regEx);

  const issues =
    matches !== null
      ? matches.map((match) =>
          match.replace(/\"|updates?|resolves?|closes?:?\s/gi, "").trim()
        )
      : [];

  return issues;
};

module.exports = parseCommitBody;

// Test the function with a sample commit message
const message = `feat: MVP-687 Show submit button for label members as well (#368)
    feat: Show submit button for label members & owners - Frontend`;
console.log(parseCommitBody(message));
