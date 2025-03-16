terraform {
  backend "s3" {
    bucket = "awarri-terraform-state-bucket"
    key    = "terraform.tfstate"
    region = "us-east-1"
    # dynamodb_table = "awarri-terraform-lock" 
    encrypt        = true
  }
}