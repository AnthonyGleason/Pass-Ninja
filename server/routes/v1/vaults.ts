import express, { Router } from 'express';

export const vaultsRouter:Router = express.Router();

// • GET	/api/v1/users/:userID/vaults/:vaultID		get users vault data with hashed passwords
// • POST	/api/v1/users/:userID/vaults/:vaultID/passwords/	create a new password in a vault
// • PUT	/api/v1/users/:userID/vaults/:vaultID/passwords/:passwordID	update a password entry in the vault