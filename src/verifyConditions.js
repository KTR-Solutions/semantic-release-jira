const getAuthHeader = require("./functions/getAuthHeader");

/**
 * verifyConditions plugin method which checks passed in arguments
 *
 * @param {object} pluginConfig config passed in by semantic-release
 * @param {object} context plugin context passed in by semantic-release
 * @async
 * @throws error messages for invalid or missing arguments
 */
async function verifyConditions(pluginConfig, context) {
  const { env, logger } = context;
  const { auth } = pluginConfig;

  logger.debug("Verifying Jira Auth");

  const authHeader = await !!getAuthHeader({ auth, env, logger });
  logger.debug("Verifying Jira Auth [result=" + authHeader + "]");
  return authHeader;
}

module.exports = verifyConditions;
