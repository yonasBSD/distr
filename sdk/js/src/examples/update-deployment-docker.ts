import {DistrService} from '../client/service';
import {clientConfig} from './config';

const gc = new DistrService(clientConfig);

const deploymentTargetId = '<docker-deployment-target-id>';
await gc.updateDeployment({deploymentTargetId}); // update to latest version (according to the given strategy) of application that is already deployed
