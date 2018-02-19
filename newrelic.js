/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['dev-18f'],
  /**
   * Your New Relic license key.
     license_key: '73a21f3cda43b2b79dc76d97f1c409fa151c8942',
   */
  license_key: '8a8e8af54c5714d270e0b632a4aa1d15c659dc76',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
