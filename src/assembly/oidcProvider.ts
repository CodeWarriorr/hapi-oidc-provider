import { Provider } from 'oidc-provider';
import configuration from '../config';

// INFO: using memory adapter
export default new Provider('http://localhost:4900', configuration);
