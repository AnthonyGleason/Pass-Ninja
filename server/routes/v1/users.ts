import express, { Router } from 'express';
import { vaultsRouter } from './vaults';

export const usersRouter:Router = express.Router();

usersRouter.use('/vaults',vaultsRouter)

// • POST	/api/v1/users/	create an account and vault for the user 
// • GET 	/api/v1/users/verify	verify the token has provided
// • POST	/api/v1/users/login	sign into already existing account 
// • POST	/api/v1/users/logout	log out of account invalidating the users token