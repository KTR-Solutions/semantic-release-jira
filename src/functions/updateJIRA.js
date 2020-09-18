const { template } = require("lodash");
const fetch = require("node-fetch");

const updateJIRA = async (params) => {
  const { apiURL, token, version, issueKey, logger } = params;

  const body = template('{ "fixVersions": [ { add: "${version}" } ] }')({
    version,
  });
  logger.debug(`Updating JIRA ${issueKey} with ${version} using body ${body}`);

  const response = await fetch(`${apiURL}issue/${issueKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body,
  }).catch((e) => {
    logger.debug(e);
  });

  if (!response || response.status >= 400) {
    logger.debug(response);
    logger.debug(`Failed updating JIRA ${issueKey} with ${version}`);
    return false;
  }

  logger.debug(`Successfully Updated JIRA ${issueKey} with ${version}`);
  return true;
};

module.exports = { updateJIRA };
