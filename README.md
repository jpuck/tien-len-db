# Tien Len Database

This is the application database, and it's stored in a git repository for immutable historical record.
Any support issues with the game state may be managed here by pull requests with a clear public consensus.

## Merging Multiple Accounts

If you have created multiple accounts or changed your username/password, and want to reflect your score under one, then add an [alias entry](./aliases.json).

## Manual Adjustments

Submit a pull request with changes only to [`users.json`](./users.json) and a pipeline will automatically update the leaderboard on merge.
