output "vpc_id" {
  value = module.network.vpc_id
}

output "public_subnets" {
  value = module.network.public_subnet_ids
}

output "private_subnets" {
  value = module.network.private_subnet_ids
}

output "db_endpoint" {
  value = module.rds.db_endpoint
}

output "s3_bucket" {
  value = module.s3.bucket_name
}

output "dynamodb_table" {
  value = module.dynamodb.table_name
}

output "user_pool_id" {
  value = module.auth.user_pool_id
}

output "cognito_client_id" {
  value = module.auth.client_id
}

output "ecr_backend_repo" {
  value = module.compute.backend_repo_url
}
