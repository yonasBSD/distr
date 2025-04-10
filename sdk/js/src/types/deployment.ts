import {BaseModel} from './base';

export interface Deployment extends BaseModel {
  deploymentTargetId: string;
  releaseName?: string;
  note?: string;
}

export interface DeploymentRequest {
  deploymentTargetId: string;
  applicationVersionId: string;
  deploymentId?: string;
  applicationLicenseId?: string;
  releaseName?: string;
  valuesYaml?: string;
  envFileData?: string;
}

export interface DeploymentWithLatestRevision extends Deployment {
  applicationId: string;
  applicationName: string;
  applicationVersionId: string;
  applicationVersionName: string;
  applicationLicenseId?: string;
  valuesYaml?: string;
  envFileData?: string;
  deploymentRevisionId?: string;
  latestStatus?: DeploymentRevisionStatus;
}

export interface DeploymentRevisionStatus extends BaseModel {
  type: DeploymentStatusType;
  message: string;
}

export type DeploymentType = 'docker' | 'kubernetes';

export type HelmChartType = 'repository' | 'oci';

export type DeploymentStatusType = 'ok' | 'progressing' | 'error';

export type DeploymentTargetScope = 'cluster' | 'namespace';
