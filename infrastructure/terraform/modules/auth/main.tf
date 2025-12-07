resource "aws_cognito_user_pool" "pool" {
  name = "${var.project_name}-${var.environment}-user-pool"

  # Attributes
  username_attributes      = ["email", "phone_number"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Welcome to BharatLink"
    email_message        = "Your verification code is {####}"
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-user-pool"
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "${var.project_name}-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.pool.id
  
  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = "${var.project_name}-${var.environment}-${var.random_suffix}"
  user_pool_id = aws_cognito_user_pool.pool.id
}

variable "project_name" { type = string }
variable "environment" { type = string }
variable "random_suffix" { type = string }

output "user_pool_id" { value = aws_cognito_user_pool.pool.id }
output "client_id" { value = aws_cognito_user_pool_client.client.id }
output "domain" { value = aws_cognito_user_pool_domain.domain.domain }
