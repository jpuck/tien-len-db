# Tien Len Database

This is the application database, and it's stored in a git repository for immutable historical record.
Any support issues with the game state may be managed here by pull requests with a clear public consensus.

## Merging Multiple Accounts

If you have created multiple accounts or changed your username/password, and want to reflect your score under one, then add an [alias entry](./aliases.json).

## Missing Claims

If for some reason a claim is missing, then you can still commit the remaining claims as long as they have consensus.

```
node scripts/conduct-census.js --no-unanimous
```
