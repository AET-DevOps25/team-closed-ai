variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "key_name" {
  type    = string
  default = "closedai-deployer"
}

variable "public_key_path" {
  type    = string
  default = "./closedai-deployer.pub"
}

variable "instance_type" {
  type    = string
  default = "t2.medium"
}

variable "root_size" {
  type    = number
  default = 24
}
