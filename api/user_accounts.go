package api

import (
	"github.com/glasskube/distr/internal/types"
	"github.com/glasskube/distr/internal/validation"
)

type CreateUserAccountRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	// Deprecated: This property will be removed in v2.
	ApplicationName string         `json:"applicationName"`
	UserRole        types.UserRole `json:"userRole"`
}

type CreateUserAccountResponse struct {
	User      types.UserAccountWithUserRole `json:"user"`
	InviteURL string                        `json:"inviteUrl"`
}

type UserAccountResponse struct {
	types.UserAccountWithUserRole
	ImageUrl string `json:"imageUrl"`
}

func AsUserAccount(u types.UserAccountWithUserRole) UserAccountResponse {
	return UserAccountResponse{
		UserAccountWithUserRole: u,
		ImageUrl:                WithImageUrl(u.ImageID),
	}
}

func MapUserAccountsToResponse(userAccounts []types.UserAccountWithUserRole) []UserAccountResponse {
	result := make([]UserAccountResponse, len(userAccounts))
	for i, u := range userAccounts {
		result[i] = AsUserAccount(u)
	}
	return result
}

type UpdateUserAccountRequest struct {
	Name     string  `json:"name"`
	Password *string `json:"password"`
}

func (r UpdateUserAccountRequest) Validate() error {
	if r.Password != nil {
		if err := validation.ValidatePassword(*r.Password); err != nil {
			return err
		}
	}
	return nil
}
