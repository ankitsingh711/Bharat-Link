module "network" {
  source = "./modules/network"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  enable_nat_gateway   = var.enable_nat_gateway
}

resource "random_id" "suffix" {
  byte_length = 4
}

module "s3" {
  source        = "./modules/s3"
  project_name  = var.project_name
  environment   = var.environment
  random_suffix = random_id.suffix.hex
}

module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
  environment  = var.environment
}

module "rds" {
  source            = "./modules/rds"
  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.network.vpc_id
  vpc_cidr          = var.vpc_cidr
  subnet_ids        = module.network.private_subnet_ids
  db_username       = var.db_username
  db_password       = var.db_password
}

module "auth" {
  source        = "./modules/auth"
  project_name  = var.project_name
  environment   = var.environment
  random_suffix = random_id.suffix.hex
}

module "compute" {
  source       = "./modules/compute"
  project_name = var.project_name
  environment  = var.environment
}
