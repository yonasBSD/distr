[**@glasskube/distr-sdk**](../README.md)

---

[@glasskube/distr-sdk](../README.md) / DeploymentTarget

# Interface: DeploymentTarget

## Extends

- [`BaseModel`](BaseModel.md).[`Named`](Named.md)

## Properties

### agentVersion?

> `optional` **agentVersion**: [`AgentVersion`](AgentVersion.md)

---

### createdAt?

> `optional` **createdAt**: `string`

#### Inherited from

[`BaseModel`](BaseModel.md).[`createdAt`](BaseModel.md#createdat)

---

### createdBy?

> `optional` **createdBy**: [`UserAccountWithRole`](UserAccountWithRole.md)

---

### currentStatus?

> `optional` **currentStatus**: [`DeploymentTargetStatus`](DeploymentTargetStatus.md)

---

### ~~deployment?~~

> `optional` **deployment**: [`DeploymentWithLatestRevision`](DeploymentWithLatestRevision.md)

#### Deprecated

This property will be removed in v2. Please consider using `deployments` instead.

---

### deployments

> **deployments**: [`DeploymentWithLatestRevision`](DeploymentWithLatestRevision.md)[]

---

### id?

> `optional` **id**: `string`

#### Inherited from

[`BaseModel`](BaseModel.md).[`id`](BaseModel.md#id)

---

### metricsEnabled

> **metricsEnabled**: `boolean`

---

### name

> **name**: `string`

#### Overrides

[`Named`](Named.md).[`name`](Named.md#name)

---

### namespace?

> `optional` **namespace**: `string`

---

### reportedAgentVersionId?

> `optional` **reportedAgentVersionId**: `string`

---

### scope?

> `optional` **scope**: [`DeploymentTargetScope`](../type-aliases/DeploymentTargetScope.md)

---

### type

> **type**: [`DeploymentType`](../type-aliases/DeploymentType.md)
