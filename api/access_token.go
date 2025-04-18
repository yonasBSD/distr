package api

import (
	"time"

	"github.com/glasskube/distr/internal/authkey"
	"github.com/google/uuid"
)

type AccessToken struct {
	ID         uuid.UUID  `json:"id"`
	CreatedAt  time.Time  `json:"createdAt"`
	ExpiresAt  *time.Time `json:"expiresAt,omitempty"`
	LastUsedAt *time.Time `json:"lastUsedAt,omitempty"`
	Label      *string    `json:"label,omitempty"`
}

func (obj AccessToken) WithKey(key authkey.Key) AccessTokenWithKey {
	return AccessTokenWithKey{obj, key}
}

type AccessTokenWithKey struct {
	AccessToken
	Key authkey.Key `json:"key"`
}

type CreateAccessTokenRequest struct {
	ExpiresAt *time.Time `json:"expiresAt"`
	Label     *string    `json:"label"`
}
