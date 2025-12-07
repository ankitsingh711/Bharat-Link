resource "aws_dynamodb_table" "activity_logs" {
  name           = "${var.project_name}-${var.environment}-activity-logs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pk"
  range_key      = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
  
  # GSI for querying by type/date
  attribute {
    name = "gsi1pk"
    type = "S"
  }
  
  attribute {
    name = "gsi1sk"
    type = "S"
  }

  global_secondary_index {
    name               = "gsi1"
    hash_key           = "gsi1pk"
    range_key          = "gsi1sk"
    projection_type    = "ALL"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-activity"
  }
}

variable "project_name" { type = string }
variable "environment" { type = string }

output "table_name" { value = aws_dynamodb_table.activity_logs.name }
output "table_arn" { value = aws_dynamodb_table.activity_logs.arn }
