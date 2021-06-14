import ipRegex from 'ip-regex';
import { constant } from '../../config';
import buildMakeSource from '../source';
import buildMakeUser from './user';

const makeSource = buildMakeSource({ isValidIp });
const makeUser = buildMakeUser({ constant });

export default makeUser;

function isValidIp(ip) {
  return ipRegex({ exact: true }).test(ip);
}
