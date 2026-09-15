# Execution Associates private mail

Private entry point: https://app.execution.associates. There is deliberately no public website login link. Better Auth accepts magic links for the two identities configured in the root-only runtime environment; Mailflare password authentication is blocked at the gateway.

The maintained AGPL inbox source is https://github.com/dSaulJameson/execution-associates-mail. `mailflare-revision.txt` pins its production commit. Changes to that repository require reviewing and updating this pin; upstream updates are not automatically deployed.

The gateway maps each approved login to its own Mailflare user. The shared database does not grant either mailbox access to the other. Saul is the workspace administrator. Account administration and explicitly granted shared-mailbox access remain available.

## Deployment

The main-branch HostHatch workflow builds the public site and activates the private app through `/usr/local/sbin/deploy-execution-private`. Secrets reside only in `/opt/execution-private/runtime.env`; never commit them. Inbound delivery uses the HMAC-authenticated Cloudflare worker in `ops/mail-relay.mjs`. Outbound messages use a send-only Cloudflare credential, not the account provisioning credential.

Persistent Docker volumes: `execution-private_auth-data` and `execution-private_shared-mail`. The unused `execution-private_saul-mail` and `execution-private_stephan-mail` volumes are retained as recoverable pre-consolidation backups. Do not run `docker compose down -v`.

Run `docker exec execution-private-gateway node verify-live.mjs` for both login flows, isolation, replay rejection, CSRF, and logout checks. Add `--mail` only when authorized to send setup messages. Tokens are never logged. Mailflare provides built-in backup management; configure off-host backup storage before relying on this host as the only copy of business mail.
