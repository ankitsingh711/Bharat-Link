resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-media-${var.random_suffix}"
  
  tags = {
    Name = "${var.project_name}-${var.environment}-media"
  }
}

resource "aws_s3_bucket_ownership_controls" "main" {
  bucket = aws_s3_bucket.main.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "main" {
  depends_on = [aws_s3_bucket_ownership_controls.main]

  bucket = aws_s3_bucket.main.id
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"] # Restrict this in production
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

variable "project_name" { type = string }
variable "environment" { type = string }
variable "random_suffix" { type = string }

output "bucket_name" { value = aws_s3_bucket.main.bucket }
output "bucket_arn" { value = aws_s3_bucket.main.arn }
