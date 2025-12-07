terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Backend configuration is usually passed via -backend-config or a separate file
    # keys: bucket, key, region, dynamodb_table
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "BharatLink"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
