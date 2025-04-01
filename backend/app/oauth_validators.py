from oauth2_provider.oauth2_validators import OAuth2Validator


class CustomOAuth2Validator(OAuth2Validator):
    oidc_claim_scope = None

    def get_additional_claims(self, request):
        full_name = ' '.join([request.user.first_name, request.user.last_name])
        return {
            "given_name": request.user.first_name,
            "family_name": request.user.last_name,
            "name": full_name,
            "preferred_username": request.user.username,
            "email": request.user.email,
            "picture": f"https://ui-avatars.com/api/?name={request.user.username}&rounded=true&background=3559c7&size=35&color=fff"
        }

    def get_userinfo_claims(self, request):
        claims = super().get_userinfo_claims(request)
        return claims
