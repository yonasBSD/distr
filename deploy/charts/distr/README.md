<h1 align="center">
  <a href="https://distr.sh/" target="_blank">
    <img alt="" src="https://github.com/glasskube/distr/raw/refs/heads/main/frontend/ui/public/distr-logo.svg" style="height: 5em;">
  </a>
  <br>
  Distr
</h1>

<div align="center">

**Software Distribution Platform**

</div>

![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational?style=flat-square)

The easiest way to distribute enterprise software

**Homepage:** <https://distr.sh/docs/>

## Prerequisites

[Helm](https://helm.sh) must be installed to use the charts. Please refer to Helm's [documentation](https://helm.sh/docs) to get started.

## Installation

Distr is available as a Helm chart distributed via ghcr.io.
To install Distr in Kubernetes, simply run:

<!-- x-release-please-start-version -->

```shell
helm upgrade --install --wait --namespace distr --create-namespace \
  distr oci://ghcr.io/glasskube/charts/distr --version 1.0.0 \
  --set postgresql.enabled=true
```

<!-- x-release-please-end -->

## Requirements

| Repository                               | Name       | Version |
| ---------------------------------------- | ---------- | ------- |
| oci://registry-1.docker.io/bitnamicharts | postgresql | 16.x.x  |

## Values

| Key                                        | Type   | Default                                          | Description |
| ------------------------------------------ | ------ | ------------------------------------------------ | ----------- |
| affinity                                   | object | `{}`                                             |             |
| autoscaling.enabled                        | bool   | `false`                                          |             |
| autoscaling.maxReplicas                    | int    | `10`                                             |             |
| autoscaling.minReplicas                    | int    | `2`                                              |             |
| autoscaling.targetCPUUtilizationPercentage | int    | `100`                                            |             |
| externalDatabase.existingSecret            | string | `""`                                             |             |
| externalDatabase.existingSecretUriKey      | string | `"uri"`                                          |             |
| externalDatabase.uri                       | string | `""`                                             |             |
| fullnameOverride                           | string | `""`                                             |             |
| hub.envFrom                                | list   | `[]`                                             |             |
| hub.env[0].name                            | string | `"DISTR_HOST"`                                   |             |
| hub.env[0].value                           | string | `"http://distr.local"`                           |             |
| hub.env[1].name                            | string | `"JWT_SECRET"`                                   |             |
| hub.env[1].value                           | string | `"WQrGMYx4tZdGwKlt0RTrhMzfQ+j1wr6z7oRWfmGlETk="` |             |
| hub.env[2].name                            | string | `"MAILER_FROM_ADDRESS"`                          |             |
| hub.env[2].value                           | string | `"My Distr <noreply@distr.local>"`               |             |
| hub.env[3].name                            | string | `"MAILER_TYPE"`                                  |             |
| hub.env[3].value                           | string | `"smtp"`                                         |             |
| hub.env[4].name                            | string | `"MAILER_SMTP_HOST"`                             |             |
| hub.env[4].value                           | string | `"smtp.example.local"`                           |             |
| hub.env[5].name                            | string | `"MAILER_SMTP_PORT"`                             |             |
| hub.env[5].value                           | string | `"25"`                                           |             |
| image.pullPolicy                           | string | `"IfNotPresent"`                                 |             |
| image.repository                           | string | `"ghcr.io/glasskube/distr"`                      |             |
| image.tag                                  | string | `""`                                             |             |
| imagePullSecrets                           | list   | `[]`                                             |             |
| ingress.annotations                        | object | `{}`                                             |             |
| ingress.className                          | string | `""`                                             |             |
| ingress.enabled                            | bool   | `false`                                          |             |
| ingress.hosts[0].host                      | string | `"distr.local"`                                  |             |
| ingress.hosts[0].paths[0].path             | string | `"/"`                                            |             |
| ingress.hosts[0].paths[0].pathType         | string | `"ImplementationSpecific"`                       |             |
| ingress.tls                                | list   | `[]`                                             |             |
| livenessProbe.httpGet.path                 | string | `"/"`                                            |             |
| livenessProbe.httpGet.port                 | string | `"http"`                                         |             |
| nameOverride                               | string | `""`                                             |             |
| nodeSelector                               | object | `{}`                                             |             |
| podAnnotations                             | object | `{}`                                             |             |
| podLabels                                  | object | `{}`                                             |             |
| podSecurityContext                         | object | `{}`                                             |             |
| postgresql.architecture                    | string | `"standalone"`                                   |             |
| postgresql.auth.database                   | string | `"distr"`                                        |             |
| postgresql.auth.existingSecret             | string | `""`                                             |             |
| postgresql.auth.password                   | string | `""`                                             |             |
| postgresql.auth.username                   | string | `"distr"`                                        |             |
| postgresql.enabled                         | bool   | `false`                                          |             |
| postgresql.service.ports.postgresql        | int    | `5432`                                           |             |
| readinessProbe.httpGet.path                | string | `"/"`                                            |             |
| readinessProbe.httpGet.port                | string | `"http"`                                         |             |
| replicaCount                               | int    | `2`                                              |             |
| resources                                  | object | `{}`                                             |             |
| securityContext                            | object | `{}`                                             |             |
| service.port                               | int    | `8080`                                           |             |
| service.type                               | string | `"ClusterIP"`                                    |             |
| serviceAccount.annotations                 | object | `{}`                                             |             |
| serviceAccount.automount                   | bool   | `true`                                           |             |
| serviceAccount.create                      | bool   | `true`                                           |             |
| serviceAccount.name                        | string | `""`                                             |             |
| tolerations                                | list   | `[]`                                             |             |
| volumeMounts                               | list   | `[]`                                             |             |
| volumes                                    | list   | `[]`                                             |             |

## Maintainers

| Name      | Email | Url                            |
| --------- | ----- | ------------------------------ |
| Glasskube |       | <https://github.com/glasskube> |

---

Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
