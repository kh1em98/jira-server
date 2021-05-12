import { User } from '../entity/User';

export interface SessionData {
	userId?: number;
	user?: User;
}
